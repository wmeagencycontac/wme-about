# WME Agency Backend

A Node.js/Express backend server for the WME (William Morris Endeavor) agency website.

## Features

- ✅ Static file serving for HTML, CSS, and JavaScript
- ✅ Contact form API with email notifications
- ✅ Content management API endpoints
- ✅ Security middleware (CORS, Helmet, Rate limiting)
- ✅ Environment-based configuration
- ✅ Error handling and logging

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Access your website:**
   - Main site: http://localhost:3000
   - Contact page: http://localhost:3000/contact
   - API health check: http://localhost:3000/api/health

## Project Structure

```
├── public/                 # Static files (HTML, CSS, JS, images)
│   ├── index.html         # Main About page
│   └── contact.html       # Contact form page
├── routes/                # API route handlers
│   └── api.js            # Main API routes
├── server.js             # Express server setup
├── .env                  # Environment variables
├── .env.example          # Environment template
└── package.json          # Dependencies and scripts
```

## API Endpoints

### Health Check
- **GET** `/api/health` - Server health status

### Contact Form
- **POST** `/api/contact` - Submit contact form
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Example Corp",
    "expertise": "digital",
    "message": "Hello, I'm interested in your services."
  }
  ```

### Content Management
- **GET** `/api/content/expertise` - Get all expertise areas
- **GET** `/api/content/company` - Get company information

## Email Configuration

To enable contact form email notifications, configure these environment variables in `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@wmeagency.com
TO_EMAIL=contact@wmeagency.com
```

### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: Google Account → Security → App passwords
3. Use the app password as `SMTP_PASS`

## Security Features

- **CORS**: Cross-Origin Resource Sharing enabled
- **Helmet**: Security headers protection
- **Rate Limiting**: Contact form limited to 3 submissions per 15 minutes per IP
- **Input Validation**: Email validation and required field checks
- **Error Handling**: Comprehensive error handling with development/production modes

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `SMTP_PORT` | Email server port | `587` |
| `SMTP_USER` | Email username | - |
| `SMTP_PASS` | Email password | - |
| `FROM_EMAIL` | Sender email address | `noreply@wmeagency.com` |
| `TO_EMAIL` | Recipient email address | `contact@wmeagency.com` |

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run tests (not implemented yet)

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Configure email settings for contact form
3. Consider using a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "wme-agency"
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
