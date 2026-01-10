# 🏜️ Morocco Desert Riders API

A complete RESTful API for the Morocco Desert Riders tour booking application built with Node.js, Express, and MySQL.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- MySQL >= 8.0
- npm or yarn

### Installation

1. **Clone/Copy the backend-api folder to your server**

2. **Install dependencies:**
   ```bash
   cd backend-api
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Run database migration:**
   ```bash
   npm run migrate
   ```

5. **Seed sample data (optional):**
   ```bash
   npm run seed
   ```

6. **Start the server:**
   ```bash
   # Development (with hot reload)
   npm run dev

   # Production
   npm start
   ```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication

The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-token>
```

---

## 🔐 Auth Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>

{
  "name": "John Updated",
  "phone": "+0987654321"
}
```

### Change Password
```http
PUT /auth/password
Authorization: Bearer <token>

{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

---

## 🏜️ Tours Endpoints

### List Tours (Public)
```http
GET /tours?page=1&limit=10&city_id=1&category_id=2&min_price=500&max_price=5000&sort=price_asc
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10, max: 100) |
| city_id | number | Filter by city |
| category_id | number | Filter by category |
| min_price | number | Minimum price |
| max_price | number | Maximum price |
| duration | number | Exact duration in days |
| search | string | Search in name/description |
| sort | string | price_asc, price_desc, duration_asc, duration_desc, rating, popular, newest |

### Get Featured Tours
```http
GET /tours/featured?limit=6
```

### Get Single Tour
```http
GET /tours/:id
```

### Create Tour (Admin)
```http
POST /tours
Authorization: Bearer <admin-token>

{
  "name": "Sahara Adventure",
  "city_id": 1,
  "category_id": 1,
  "description": "Amazing desert experience",
  "duration_days": 3,
  "price_standard": 2500,
  "price_premium": 4500,
  "max_guests": 12,
  "images": ["/uploads/tour1.jpg", "/uploads/tour2.jpg"]
}
```

### Update Tour (Admin)
```http
PUT /tours/:id
Authorization: Bearer <admin-token>

{
  "price_standard": 2800,
  "is_active": true
}
```

### Delete Tour (Admin)
```http
DELETE /tours/:id
Authorization: Bearer <admin-token>
```

### Get Tour Reviews
```http
GET /tours/:id/reviews?page=1&limit=10
```

---

## 🏙️ Cities Endpoints

### List Cities
```http
GET /cities
```

### Get City with Tours
```http
GET /cities/:id
```

### Create City (Admin)
```http
POST /cities
Authorization: Bearer <admin-token>

{
  "name": "Marrakech",
  "description": "The Red City",
  "image_url": "/images/marrakech.jpg"
}
```

### Update City (Admin)
```http
PUT /cities/:id
```

### Delete City (Admin)
```http
DELETE /cities/:id
```

---

## 📂 Categories Endpoints

### List Categories
```http
GET /categories
```

### Get Category with Tours
```http
GET /categories/:id
```

### Create Category (Admin)
```http
POST /categories
Authorization: Bearer <admin-token>

{
  "name": "Desert Safari",
  "icon": "🏜️"
}
```

### Update/Delete Category (Admin)
```http
PUT /categories/:id
DELETE /categories/:id
```

---

## 📅 Bookings Endpoints

### List Bookings
```http
GET /bookings?page=1&status=confirmed&start_date=2024-01-01
Authorization: Bearer <token>
```
*Clients see only their bookings, admins see all*

### Get Booking Statistics (Admin)
```http
GET /bookings/stats
Authorization: Bearer <admin-token>
```

### Get Single Booking
```http
GET /bookings/:id
Authorization: Bearer <token>
```

### Create Booking
```http
POST /bookings
Authorization: Bearer <token>

{
  "tour_id": 1,
  "start_date": "2024-06-15",
  "guests": 2,
  "tier": "premium",
  "special_requests": "Vegetarian meals please"
}
```

### Update Booking
```http
PUT /bookings/:id
Authorization: Bearer <token>

{
  "guests": 3,
  "special_requests": "Updated request"
}
```
*Admin can also update status*

### Cancel Booking
```http
DELETE /bookings/:id
Authorization: Bearer <token>
```
*Clients can cancel pending bookings, admins can delete any*

### Process Payment
```http
POST /bookings/:id/payment
Authorization: Bearer <token>

{
  "method": "stripe",
  "transaction_id": "txn_123abc"
}
```

---

## ⭐ Reviews Endpoints

### List Reviews
```http
GET /reviews?tour_id=1&rating=5&page=1
```

### Get My Reviews
```http
GET /reviews/my
Authorization: Bearer <token>
```

### Create Review
```http
POST /reviews
Authorization: Bearer <token>

{
  "tour_id": 1,
  "rating": 5,
  "comment": "Amazing experience!"
}
```

### Update Review
```http
PUT /reviews/:id
Authorization: Bearer <token>

{
  "rating": 4,
  "comment": "Updated review"
}
```

### Delete Review
```http
DELETE /reviews/:id
Authorization: Bearer <token>
```

---

## 👥 Users Endpoints (Admin Only)

### List Users
```http
GET /users?page=1&search=john&role=client
Authorization: Bearer <admin-token>
```

### Get User Details
```http
GET /users/:id
Authorization: Bearer <admin-token>
```

### Create User
```http
POST /users
Authorization: Bearer <admin-token>

{
  "name": "New User",
  "email": "new@example.com",
  "password": "Password123!",
  "role": "admin"
}
```

### Update User
```http
PUT /users/:id
Authorization: Bearer <admin-token>

{
  "role": "admin"
}
```

### Delete User
```http
DELETE /users/:id
Authorization: Bearer <admin-token>
```

### Get User's Bookings
```http
GET /users/:id/bookings
Authorization: Bearer <admin-token>
```

---

## 📤 Export Endpoints

### Download Booking Invoice (PDF)
```http
GET /export/booking/:id/invoice
Authorization: Bearer <token>
```
*Returns PDF file*

### Export Bookings (CSV)
```http
GET /export/bookings/csv?start_date=2024-01-01&end_date=2024-12-31&status=completed
Authorization: Bearer <admin-token>
```
*Returns CSV file*

### Export Bookings (Excel)
```http
GET /export/bookings/excel?start_date=2024-01-01
Authorization: Bearer <admin-token>
```
*Returns XLSX file with Bookings and Summary sheets*

---

## 🧪 Test Credentials

After running `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@moroccodesert.com | Admin123! |
| Client | sarah@example.com | User123! |

---

## 📁 Project Structure

```
backend-api/
├── src/
│   ├── config/
│   │   └── database.js         # MySQL connection pool
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT authentication
│   │   ├── error.middleware.js # Error handling
│   │   └── validation.middleware.js # Request validation
│   ├── routes/
│   │   ├── auth.routes.js      # Authentication endpoints
│   │   ├── user.routes.js      # User management (admin)
│   │   ├── tour.routes.js      # Tour CRUD
│   │   ├── city.routes.js      # City CRUD
│   │   ├── category.routes.js  # Category CRUD
│   │   ├── booking.routes.js   # Booking management
│   │   ├── review.routes.js    # Review management
│   │   └── export.routes.js    # PDF/CSV/Excel exports
│   ├── database/
│   │   ├── migrate.js          # Database migration
│   │   └── seed.js             # Sample data seeder
│   └── server.js               # Express app entry point
├── uploads/                    # Uploaded files directory
├── .env.example               # Environment variables template
├── package.json
└── README.md
```

---

## 🔒 Security Features

- **JWT Authentication** with configurable expiration
- **Password Hashing** using bcrypt (12 rounds)
- **Rate Limiting** to prevent abuse
- **Helmet** for security headers
- **CORS** configuration
- **Input Validation** using express-validator
- **Role-Based Access Control** (admin vs client)
- **SQL Injection Prevention** via parameterized queries

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

---

## 🛠️ Development

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment | development |
| DB_HOST | MySQL host | localhost |
| DB_PORT | MySQL port | 3306 |
| DB_USER | MySQL user | root |
| DB_PASSWORD | MySQL password | |
| DB_NAME | Database name | morocco_desert_riders |
| JWT_SECRET | JWT signing key | (required) |
| JWT_EXPIRES_IN | Token expiration | 7d |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:5173 |

---

## 📄 License

MIT License - Morocco Desert Riders © 2024
