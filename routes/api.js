const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');

// Rate limiting for contact form
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    message: {
        success: false,
        message: 'Too many contact form submissions, please try again later.'
    }
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'WME Agency API is running',
        timestamp: new Date().toISOString()
    });
});

// Contact form endpoint
router.post('/contact', contactLimiter, async (req, res) => {
    try {
        const { name, email, company, message, expertise } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required.'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address.'
            });
        }

        // Create email transporter (configure with your email service)
        const transporter = nodemailer.createTransporter({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Email content
        const emailContent = {
            from: process.env.FROM_EMAIL || 'noreply@wmeagency.com',
            to: process.env.TO_EMAIL || 'contact@wmeagency.com',
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
                ${expertise ? `<p><strong>Expertise Interest:</strong> ${expertise}</p>` : ''}
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><small>Submitted at: ${new Date().toISOString()}</small></p>
            `
        };

        // Send email (only if SMTP is configured)
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            await transporter.sendMail(emailContent);
        } else {
            console.log('📧 Contact form submission (email not configured):', {
                name, email, company, expertise, message
            });
        }

        res.json({
            success: true,
            message: 'Thank you for your message. We will get back to you soon!'
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Sorry, there was an error sending your message. Please try again later.'
        });
    }
});

// Content management endpoints
router.get('/content/expertise', (req, res) => {
    const expertiseAreas = [
        { slug: 'acting-talent', name: 'Acting Talent' },
        { slug: 'television', name: 'Television' },
        { slug: 'motion-picture', name: 'Motion Picture' },
        { slug: 'wme-independent', name: 'WME Independent' },
        { slug: 'fashion', name: 'Fashion' },
        { slug: 'sports', name: 'Sports' },
        { slug: 'digital', name: 'Digital' },
        { slug: 'theater', name: 'Theater' },
        { slug: 'music', name: 'Music' },
        { slug: 'comedy', name: 'Comedy' },
        { slug: 'books-literary-media', name: 'Books & Literary Media' },
        { slug: 'impact', name: 'Impact, Inclusion & Advocacy' },
        { slug: 'brands', name: 'Brands' },
        { slug: 'production', name: 'Production' },
        { slug: 'speaking', name: 'Speaking' }
    ];

    res.json({
        success: true,
        data: expertiseAreas
    });
});

// Company information endpoint
router.get('/content/company', (req, res) => {
    res.json({
        success: true,
        data: {
            name: 'WME',
            fullName: 'William Morris Endeavor',
            tagline: 'The Original Advocate For The World\'s Most Extraordinary Talent',
            description: 'WME is the original advocate for the world\'s most extraordinary artists, content creators, and talent across books, digital media, fashion, film, food, music, sports, television, and theater.',
            experienceYears: 125,
            social: {
                instagram: 'https://www.instagram.com/wme/',
                tiktok: 'https://www.tiktok.com/@wme',
                linkedin: 'https://www.linkedin.com/company/william-morris-endeavor',
                twitter: '@wme'
            }
        }
    });
});

module.exports = router;
