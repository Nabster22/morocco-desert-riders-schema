# Morocco Desert Riders - cPanel Deployment Guide

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [SSL Configuration](#ssl-configuration)
6. [Cron Jobs](#cron-jobs)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Before deploying, ensure you have:

- cPanel hosting with Node.js support (or use Passenger/PM2)
- MySQL 5.7+ or MariaDB 10.3+
- SSL certificate (Let's Encrypt recommended)
- Domain pointed to your hosting
- FTP/SFTP access or File Manager access

---

## 🗄️ Database Setup

### Step 1: Create MySQL Database

1. Log into cPanel
2. Navigate to **MySQL® Databases**
3. Create a new database:
   - Database name: `moroccodesert_db` (cPanel will prefix with your username)
   - Click **Create Database**

### Step 2: Create Database User

1. In the same section, scroll to **MySQL Users**
2. Create a new user:
   - Username: `moroccodesert_user`
   - Password: Generate a strong password (save this!)
   - Click **Create User**

### Step 3: Assign User to Database

1. Scroll to **Add User To Database**
2. Select your user and database
3. Click **Add**
4. Grant **ALL PRIVILEGES**
5. Click **Make Changes**

### Step 4: Import SQL Data

#### Option A: Via phpMyAdmin
1. Go to **phpMyAdmin** in cPanel
2. Select your database from the left sidebar
3. Click **Import** tab
4. Choose file: `database/morocco_desert_riders.sql`
5. Click **Go**

#### Option B: Via Command Line (SSH)
```bash
mysql -u username_moroccodesert_user -p username_moroccodesert_db < database/morocco_desert_riders.sql
```

---

## 🖥️ Backend Deployment

### Step 1: Upload Backend Files

1. Connect via FTP/SFTP or use cPanel File Manager
2. Navigate to a folder outside `public_html` (e.g., `/home/username/api/`)
3. Upload the entire `backend-api` folder contents:
   ```
   /home/username/api/
   ├── src/
   ├── package.json
   ├── .env
   └── ...
   ```

### Step 2: Configure Environment

1. Rename `.env.example` to `.env`
2. Edit `.env` with your production values:

```env
# ==============================================
# PRODUCTION CONFIGURATION
# ==============================================

# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration (use cPanel credentials)
DB_HOST=localhost
DB_PORT=3306
DB_USER=username_moroccodesert_user
DB_PASSWORD=your_secure_password_here
DB_NAME=username_moroccodesert_db

# JWT Configuration (generate secure secret)
# Run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_64_character_hex_secret_here
JWT_EXPIRES_IN=7d

# CORS Configuration (your frontend domain)
CORS_ORIGIN=https://moroccodesert.com

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

# Rate Limiting (production values)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Payment Gateways (optional)
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
```

### Step 3: Install Dependencies

#### Via SSH:
```bash
cd /home/username/api
npm install --production
```

#### Via cPanel Terminal:
1. Go to **Terminal** in cPanel
2. Run the same commands

### Step 4: Setup Node.js Application

#### Option A: cPanel Node.js Selector
1. Go to **Setup Node.js App** in cPanel
2. Click **Create Application**
3. Configure:
   - Node.js version: 18.x or higher
   - Application mode: Production
   - Application root: `/home/username/api`
   - Application URL: `api.yourdomain.com` or `yourdomain.com/api`
   - Application startup file: `src/server.js`
4. Click **Create**
5. Run `npm install` from the interface

#### Option B: PM2 Process Manager (SSH required)
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
cd /home/username/api
pm2 start src/server.js --name "morocco-api"

# Save PM2 process list
pm2 save

# Setup PM2 to start on reboot
pm2 startup
```

### Step 5: Configure API Subdomain (Recommended)

1. Go to **Subdomains** in cPanel
2. Create subdomain: `api.yourdomain.com`
3. Point it to your Node.js application

---

## 🌐 Frontend Deployment

### Step 1: Build Frontend

On your local machine:
```bash
# Navigate to project root
cd morocco-desert-riders

# Install dependencies
npm install

# Build for production
npm run build
```

This creates a `dist/` folder with optimized files.

### Step 2: Upload Frontend

1. Connect via FTP/SFTP or use cPanel File Manager
2. Navigate to `public_html` (or subdomain folder)
3. Upload contents of `dist/` folder:
   ```
   /home/username/public_html/
   ├── index.html
   ├── assets/
   │   ├── index-xxx.js
   │   ├── index-xxx.css
   │   └── images/
   └── .htaccess
   ```

### Step 3: Configure .htaccess

Upload the `.htaccess` file to `public_html`:

```apache
# Morocco Desert Riders - Apache Configuration
# ==============================================

# Enable Rewrite Engine
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Remove www (optional - choose one)
# RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
# RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

# SPA Fallback - Route all requests to index.html
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-l
RewriteRule . /index.html [L]

# ==============================================
# Security Headers
# ==============================================

<IfModule mod_headers.c>
    # Prevent clickjacking
    Header always set X-Frame-Options "SAMEORIGIN"
    
    # XSS Protection
    Header always set X-XSS-Protection "1; mode=block"
    
    # Prevent MIME type sniffing
    Header always set X-Content-Type-Options "nosniff"
    
    # Referrer Policy
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Content Security Policy
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.yourdomain.com https://*.tile.openstreetmap.org; frame-ancestors 'self';"
    
    # Permissions Policy
    Header always set Permissions-Policy "geolocation=(self), microphone=(), camera=()"
</IfModule>

# ==============================================
# Caching
# ==============================================

<IfModule mod_expires.c>
    ExpiresActive On
    
    # Images
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"
    
    # CSS and JavaScript
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/javascript "access plus 1 year"
    
    # Fonts
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/ttf "access plus 1 year"
    
    # HTML - short cache
    ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Cache-Control headers
<IfModule mod_headers.c>
    # Cache static assets for 1 year
    <FilesMatch "\.(ico|pdf|jpg|jpeg|png|gif|webp|svg|js|css|woff|woff2|ttf)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
    
    # No cache for HTML
    <FilesMatch "\.(html)$">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
        Header set Pragma "no-cache"
        Header set Expires 0
    </FilesMatch>
</IfModule>

# ==============================================
# Compression
# ==============================================

<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE text/javascript
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/json
    AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# ==============================================
# Error Pages
# ==============================================

ErrorDocument 404 /index.html
ErrorDocument 500 /index.html
```

### Step 4: Update API Base URL

Before building, update `src/services/api.ts`:

```typescript
const API_BASE_URL = 'https://api.yourdomain.com/api/v1';
```

Or use environment variable:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.yourdomain.com/api/v1';
```

---

## 🔒 SSL Configuration

### Option A: Let's Encrypt (Recommended - Free)

1. Go to **SSL/TLS** in cPanel
2. Click **Manage SSL sites** or **Let's Encrypt SSL**
3. Select your domain
4. Click **Issue** or **Install**

### Option B: Custom SSL Certificate

1. Go to **SSL/TLS** in cPanel
2. Click **Install and Manage SSL**
3. Upload your certificate files:
   - Certificate (CRT)
   - Private Key
   - CA Bundle (optional)
4. Click **Install Certificate**

---

## ⏰ Cron Jobs (Optional)

Set up automated tasks in cPanel:

1. Go to **Cron Jobs** in cPanel
2. Add the following jobs:

### Daily Database Backup
```
0 2 * * * /usr/bin/mysqldump -u username_moroccodesert_user -p'password' username_moroccodesert_db > /home/username/backups/db_$(date +\%Y\%m\%d).sql
```

### Weekly Old Backup Cleanup
```
0 3 * * 0 find /home/username/backups -name "*.sql" -mtime +30 -delete
```

### Check API Health (Every 5 minutes)
```
*/5 * * * * curl -s https://api.yourdomain.com/health > /dev/null || echo "API Down" | mail -s "Morocco API Alert" admin@yourdomain.com
```

### Clear Old Sessions (Daily)
```
0 4 * * * cd /home/username/api && /usr/local/bin/node scripts/cleanup.js
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. 500 Internal Server Error
- Check `.htaccess` syntax
- Verify file permissions (755 for folders, 644 for files)
- Check cPanel error logs

#### 2. API Connection Failed
- Verify CORS_ORIGIN in `.env` matches frontend domain
- Check if Node.js app is running
- Test API directly: `https://api.yourdomain.com/health`

#### 3. Database Connection Error
- Verify database credentials in `.env`
- Ensure database user has all privileges
- Check if MySQL service is running

#### 4. Blank Page / Routes Not Working
- Ensure `.htaccess` is uploaded
- Verify `mod_rewrite` is enabled
- Check browser console for errors

#### 5. Images Not Loading
- Verify image paths in code
- Check file permissions
- Ensure images are uploaded to correct directory

### Useful Commands (SSH)

```bash
# Check Node.js version
node -v

# Check if API is running
curl http://localhost:3000/health

# View PM2 logs
pm2 logs morocco-api

# Restart API
pm2 restart morocco-api

# Check MySQL connection
mysql -u username_moroccodesert_user -p -e "SELECT 1"
```

### Log Locations

- **Apache Error Log**: `/home/username/logs/error.log`
- **Node.js Logs**: PM2 logs or cPanel Node.js logs
- **MySQL Error Log**: Contact hosting support

---

## 📁 Final Directory Structure

```
/home/username/
├── api/                          # Backend API
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.js
│   ├── uploads/                  # Uploaded files
│   ├── node_modules/
│   ├── package.json
│   └── .env
│
├── public_html/                  # Frontend
│   ├── assets/
│   │   ├── index-xxx.js
│   │   └── index-xxx.css
│   ├── index.html
│   └── .htaccess
│
└── backups/                      # Database backups
    └── db_20240115.sql
```

---

## ✅ Deployment Checklist

- [ ] Database created and user assigned
- [ ] SQL data imported successfully
- [ ] Backend `.env` configured with production values
- [ ] Node.js dependencies installed
- [ ] Node.js app running (PM2 or cPanel)
- [ ] Frontend built with production API URL
- [ ] Frontend files uploaded to public_html
- [ ] `.htaccess` configured
- [ ] SSL certificate installed
- [ ] Cron jobs configured (optional)
- [ ] Test all functionality
- [ ] Monitor logs for errors

---

## 📞 Support

For hosting-specific issues, contact your cPanel hosting provider.

For application issues, check the GitHub repository or documentation.
