const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middleware/authMiddleware')
const {
  registerUser,
  loginUser,
  logoutUser,
  verifyToken,
  refreshToken
} = require('../controllers/authController')

// Public routes
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)

// Protected routes
router.get('/verify', authMiddleware, verifyToken)
router.post('/refresh', authMiddleware, refreshToken)

module.exports = router 