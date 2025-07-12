require('dotenv').config({ path: './config.env' })
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

// Import routes
const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')
const adminRoutes = require('./routes/adminRoutes')

const app = express()

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:8080',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:8080',
        'http://192.168.137.233:8080' // <-- add your LAN IP here
      ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads')
const avatarsDir = path.join(uploadsDir, 'avatars')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir)
}
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir)
}

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ReWear API is running',
    timestamp: new Date().toISOString()
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/admin', adminRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  
  if (err.name === 'MulterError') {
    return res.status(400).json({ 
      error: 'File upload error',
      details: err.message 
    })
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler - simplified
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 ReWear API Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
}) 