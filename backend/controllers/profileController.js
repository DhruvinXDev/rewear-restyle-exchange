const db = require('../db/db')
const { v4: uuidv4 } = require('uuid')

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params

    const [users] = await db.execute(
      `SELECT id, email, name, phone, bio, avatar_url, points, role, referral_code, created_at, updated_at
       FROM user_profiles WHERE id = ?`,
      [id]
    )

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(users[0])
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params
    const { name, phone, bio } = req.body

    // Check if user exists
    const [existingUsers] = await db.execute(
      'SELECT id FROM user_profiles WHERE id = ?',
      [id]
    )

    if (existingUsers.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Update profile
    await db.execute(
      `UPDATE user_profiles 
       SET name = ?, phone = ?, bio = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, phone, bio, id]
    )

    // Get updated profile
    const [updatedUsers] = await db.execute(
      `SELECT id, email, name, phone, bio, avatar_url, points, role, referral_code, created_at, updated_at
       FROM user_profiles WHERE id = ?`,
      [id]
    )

    res.json({
      message: 'Profile updated successfully',
      user: updatedUsers[0]
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get user's swap history
exports.getSwapHistory = async (req, res) => {
  try {
    const { id } = req.params

    const [swaps] = await db.execute(
      `SELECT 
        sh.id,
        sh.sender_id,
        sh.receiver_id,
        sh.listing_id,
        sh.status,
        sh.created_at,
        sh.updated_at,
        sender.name as sender_name,
        receiver.name as receiver_name,
        l.title as item_title,
        l.image_url as item_image
       FROM swap_history sh
       LEFT JOIN user_profiles sender ON sh.sender_id = sender.id
       LEFT JOIN user_profiles receiver ON sh.receiver_id = receiver.id
       LEFT JOIN listings l ON sh.listing_id = l.id
       WHERE sh.sender_id = ? OR sh.receiver_id = ?
       ORDER BY sh.created_at DESC`,
      [id, id]
    )

    res.json(swaps)
  } catch (error) {
    console.error('Get swap history error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get user's points history
exports.getPointsHistory = async (req, res) => {
  try {
    const { id } = req.params

    const [points] = await db.execute(
      `SELECT id, user_id, points, action, description, created_at
       FROM points_history 
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [id]
    )

    res.json(points)
  } catch (error) {
    console.error('Get points history error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Add points to user
exports.addPoints = async (req, res) => {
  try {
    const { id } = req.params
    const { points, action, description } = req.body

    // Start transaction
    const connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      // Add points history
      const pointsHistoryId = uuidv4()
      await connection.execute(
        `INSERT INTO points_history (id, user_id, points, action, description)
         VALUES (?, ?, ?, ?, ?)`,
        [pointsHistoryId, id, points, action, description]
      )

      // Update user's total points
      await connection.execute(
        `UPDATE user_profiles 
         SET points = points + ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [points, id]
      )

      await connection.commit()

      // Get updated user points
      const [updatedUsers] = await db.execute(
        'SELECT points FROM user_profiles WHERE id = ?',
        [id]
      )

      res.json({
        message: 'Points added successfully',
        newTotal: updatedUsers[0].points,
        pointsAdded: points
      })

    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Add points error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Upload avatar
exports.uploadAvatar = async (req, res) => {
  try {
    const { id } = req.params
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // In a real application, you would upload to cloud storage
    // For now, we'll just store the filename
    const avatarUrl = `/uploads/avatars/${req.file.filename}`

    // Update user's avatar
    await db.execute(
      `UPDATE user_profiles 
       SET avatar_url = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [avatarUrl, id]
    )

    res.json({
      message: 'Avatar uploaded successfully',
      avatarUrl
    })

  } catch (error) {
    console.error('Upload avatar error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
} 