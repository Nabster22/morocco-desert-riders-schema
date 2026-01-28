# 🚀 Quick Deployment Guide - Morocco Desert Riders

## Prerequisites

- cPanel hosting with Node.js support
- MySQL/MariaDB database
- SSH access (recommended) or cPanel Terminal
- Domain with SSL

---

## 📦 Step 1: Prepare Files

### Build Frontend

```bash
# On your local machine
npm run build
```

This creates `dist/` folder.

### Backend Files

Copy entire `backend-api/` folder contents.

---

## 🗄️ Step 2: Database Setup (cPanel)

1. **MySQL Databases** → Create database: `moroccodesert_db`
2. **Create user** → `moroccodesert_user` with strong password
3. **Add user to database** → ALL PRIVILEGES
4. **phpMyAdmin** → Import `backend-api/database/morocco_desert_riders.sql`

---

## ⚙️ Step 3: Deploy Backend

1. **Upload** `backend-api/` contents to `/home/username/api/`
2. **Create `.env`** from `.env.production`:

   ```env
   DB_HOST=localhost
   DB_USER=cpaneluser_moroccodesert_user
   DB_PASSWORD=your_password
   DB_NAME=cpaneluser_moroccodesert_db
   JWT_SECRET=generate_64_char_hex
   CORS_ORIGIN=https://yourdomain.com
   NODE_ENV=production
   ```

3. **Install dependencies** (SSH or Terminal):

   ```bash
   cd /home/username/api
   npm install --production
   ```

4. **Setup Node.js App** in cPanel:
   - Application root: `/home/username/api`
   - Startup file: `src/server.js`
   - Node version: 18.x+

---

## 🌐 Step 4: Deploy Frontend

1. **Upload** contents of `dist/` to `/home/username/public_html/`
2. **Upload** `.htaccess` from `public/.htaccess`
3. **Update API URL** before building:
   ```typescript
   // In src/services/api.ts
   const API_BASE_URL = 'https://api.yourdomain.com/api/v1';
   ```

---

## 🔒 Step 5: SSL (cPanel)

1. **SSL/TLS** → Let's Encrypt → Issue certificate
2. Verify HTTPS works

---

## ✅ Step 6: Test

1. Visit `https://yourdomain.com` - Frontend loads
2. Test API: `https://api.yourdomain.com/health`
3. Login with test account:
   - **Admin**: `admin@moroccodesert.com` / `Admin123!`
   - **User**: `sarah@example.com` / `User123!`

---

## 🔧 Troubleshooting

| Issue                 | Solution                                            |
| --------------------- | --------------------------------------------------- |
| 500 Error             | Check `.htaccess`, verify `mod_rewrite` enabled     |
| API Connection Failed | Check CORS_ORIGIN in `.env`, verify Node.js running |
| Database Error        | Verify credentials, check user privileges           |
| Blank Page            | Ensure `.htaccess` uploaded, check browser console  |

---

## 📁 Final Structure

```
/home/username/
├── api/                    # Backend
│   ├── src/
│   ├── node_modules/
│   ├── .env
│   └── package.json
└── public_html/            # Frontend
    ├── assets/
    ├── index.html
    └── .htaccess
```

---

## 📚 Full Documentation

See `backend-api/DEPLOYMENT.md` for complete guide including:

- Detailed step-by-step instructions
- Cron job setup
- PM2 configuration
- Security hardening
- Backup scripts
  User:
  Database:
