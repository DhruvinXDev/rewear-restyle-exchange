# ReWear Backend API

A Node.js + Express + MySQL backend for the ReWear clothing exchange platform.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- XAMPP (for MySQL)
- npm or yarn

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Database
1. Start XAMPP and ensure MySQL is running
2. Open phpMyAdmin: `http://localhost/phpmyadmin`
3. Create a new database called `rewear_db`
4. Import the schema: `database/schema.sql`

### 3. Configure Environment
Copy `config.env.example` to `config.env` and update:
```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=rewear_db
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Start Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will start on `http://localhost:3001`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/refresh` - Refresh JWT token

### Profile Management
- `GET /api/profile/:id` - Get user profile
- `PUT /api/profile/:id` - Update user profile
- `GET /api/profile/:id/swaps` - Get user's swap history
- `GET /api/profile/:id/points` - Get user's points history
- `POST /api/profile/:id/points` - Add points to user
- `POST /api/profile/:id/avatar` - Upload user avatar

### Admin Panel
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:userId/role` - Update user role
- `PUT /api/admin/users/:userId/status` - Ban/unban user
- `GET /api/admin/listings` - Get all listings
- `PUT /api/admin/listings/:listingId/status` - Update listing status
- `GET /api/admin/swaps` - Get all swaps
- `PUT /api/admin/swaps/:swapId/status` - Update swap status

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 📁 Project Structure
```
backend/
├── config.env              # Environment variables
├── server.js               # Main server file
├── package.json            # Dependencies
├── database/
│   └── schema.sql          # Database schema
├── db/
│   └── db.js               # Database connection
├── middleware/
│   └── authMiddleware.js   # JWT authentication
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── profileController.js # Profile management
│   └── adminController.js  # Admin panel logic
├── routes/
│   ├── authRoutes.js       # Auth endpoints
│   ├── profileRoutes.js    # Profile endpoints
│   └── adminRoutes.js      # Admin endpoints
└── uploads/                # File uploads directory
    └── avatars/            # User avatars
```

## 🗄️ Database Schema

### Tables
- `user_profiles` - User accounts and profiles
- `listings` - Clothing items for exchange
- `swap_history` - Exchange transactions
- `points_history` - Points earned/spent

### Sample Data
The schema includes sample users:
- **Admin**: `admin@rewear.com` / `admin123`
- **User 1**: `user1@example.com` / `admin123`
- **User 2**: `user2@example.com` / `admin123`

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (not implemented yet)

### Environment Variables
- `PORT` - Server port (default: 3001)
- `DB_HOST` - MySQL host (default: localhost)
- `DB_USER` - MySQL username (default: root)
- `DB_PASSWORD` - MySQL password (default: empty)
- `DB_NAME` - Database name (default: rewear_db)
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT token expiration (default: 7d)
- `NODE_ENV` - Environment (development/production)

## 🔧 Troubleshooting

### Database Connection Issues
1. Ensure XAMPP MySQL is running
2. Check database credentials in `config.env`
3. Verify database `rewear_db` exists
4. Run schema import in phpMyAdmin

### Port Already in Use
Change the PORT in `config.env` or kill the process using the port:
```bash
lsof -ti:3001 | xargs kill -9
```

### JWT Token Issues
1. Check JWT_SECRET in environment
2. Verify token expiration
3. Ensure Authorization header format: `Bearer <token>`

## 📝 API Examples

### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login User
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@rewear.com",
    "password": "admin123"
  }'
```

### Get User Profile (with auth)
```bash
curl -X GET http://localhost:3001/api/profile/user-001 \
  -H "Authorization: Bearer <your_jwt_token>"
```

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production` in environment
2. Use a strong JWT_SECRET
3. Configure proper CORS origins
4. Set up a production MySQL database
5. Use PM2 or similar for process management

### Environment Variables for Production
```env
NODE_ENV=production
JWT_SECRET=your_very_strong_secret_key_here
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
```

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Verify database connection
3. Check server logs for errors
4. Ensure all dependencies are installed 