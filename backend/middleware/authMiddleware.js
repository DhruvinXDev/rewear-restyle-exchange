const jwt = require('jsonwebtoken')
const db = require('../db/db')

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Get user from database
    const [rows] = await db.execute(
      'SELECT id, email, name, role, points FROM user_profiles WHERE id = ?',
      [decoded.id]
    )
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token. User not found.' })
    }

    req.user = rows[0]
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' })
  }
}

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' })
  }
  next()
}

module.exports = { authMiddleware, adminMiddleware } 