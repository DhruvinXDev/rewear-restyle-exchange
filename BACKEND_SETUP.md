# Backend Setup Guide

## 🗄️ **Database Setup (XAMPP + MySQL)**

### 1. **Install XAMPP**
- Download and install XAMPP from [apachefriends.org](https://www.apachefriends.org/)
- Start Apache and MySQL services

### 2. **Create Database**
```sql
CREATE DATABASE rewear_db;
USE rewear_db;
```

### 3. **Run Database Schema**
Copy and run the SQL from `database/schema.sql` in phpMyAdmin.

## 🚀 **Backend API Setup**

### 1. **Create Backend Directory**
```bash
mkdir backend
cd backend
npm init -y
```

### 2. **Install Dependencies**
```bash
npm install express mysql2 bcryptjs jsonwebtoken cors dotenv multer
npm install --save-dev nodemon
```

### 3. **Environment Variables**
Create `.env` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=rewear_db
JWT_SECRET=your-secret-key
PORT=3001
```

### 4. **API Routes Needed**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/profile/:id` - Get user profile
- `PUT /api/profile/:id` - Update profile
- `GET /api/profile/:id/swaps` - Get swap history
- `GET /api/profile/:id/points` - Get points history
- `POST /api/profile/:id/points` - Add points
- `POST /api/profile/:id/avatar` - Upload avatar

## 🔧 **Frontend Configuration**

Update your frontend `.env`:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## 📁 **File Structure**
```
backend/
├── server.js
├── routes/
│   ├── auth.js
│   └── profile.js
├── middleware/
│   └── auth.js
├── database/
│   └── schema.sql
└── .env
```

## 🚀 **Start Development**
1. Start XAMPP (Apache + MySQL)
2. Run backend: `npm run dev`
3. Run frontend: `npm run dev` 