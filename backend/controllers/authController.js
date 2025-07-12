const db = require('../db/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

// Generate referral code
const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Register user
exports.registerUser = async (req, res) => {
  try {
    const { email, password, name, phone, bio } = req.body

    // Check if user already exists
    const [existingUsers] = await db.execute(
      'SELECT id FROM user_profiles WHERE email = ?',
      [email]
    )

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    const userId = uuidv4()
    const referralCode = generateReferralCode()

    // Insert new user
    await db.execute(
      `INSERT INTO user_profiles (id, email, name, password, phone, bio, role, referral_code, points)
       VALUES (?, ?, ?, ?, ?, ?, 'user', ?, 0)`,
      [userId, email, name, hashedPassword, phone || null, bio || null, referralCode]
    )

    // Get the created user (without password)
    const [newUser] = await db.execute(
      'SELECT id, email, name, phone, bio, role, points, referral_code FROM user_profiles WHERE id = ?',
      [userId]
    )

    // Generate JWT token
    const token = jwt.sign(
      { id: userId, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser[0],
      token
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const [users] = await db.execute(
      'SELECT * FROM user_profiles WHERE email = ?',
      [email]
    )

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const user = users[0]

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Logout user
exports.logoutUser = async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // But we can add any cleanup logic here if needed
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Verify token
exports.verifyToken = async (req, res) => {
  try {
    // If middleware passed, token is valid
    res.json({ 
      message: 'Token is valid',
      user: req.user 
    })
  } catch (error) {
    console.error('Token verification error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const { authMiddleware } = require('../middleware/authMiddleware')
    
    // Create a new token
    const token = jwt.sign(
      { id: req.user.id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    res.json({ 
      message: 'Token refreshed successfully',
      token 
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
} 