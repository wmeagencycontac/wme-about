const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disabled for external assets from cloudfront
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Enable CORS for all routes
app.use(cors());

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Body parser middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Serve main page for all non-API routes (SPA fallback)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

app.listen(PORT, () => {
    console.log(`✅ WME Agency server is running on port ${PORT}`);
    console.log(`🌐 Access your website at: http://localhost:${PORT}`);
    console.log(`📋 API endpoints available at: http://localhost:${PORT}/api`);
});

module.exports = app;
