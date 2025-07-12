const db = require('../db/db')
const { v4: uuidv4 } = require('uuid')

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.execute(
      `SELECT 
        id, email, name, phone, bio, avatar_url, points, role, referral_code, created_at, updated_at,
        (SELECT COUNT(*) FROM listings WHERE user_id = user_profiles.id) as total_listings,
        (SELECT COUNT(*) FROM swap_history WHERE sender_id = user_profiles.id OR receiver_id = user_profiles.id) as total_swaps
       FROM user_profiles
       ORDER BY created_at DESC`
    )

    res.json(users)
  } catch (error) {
    console.error('Get all users error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params
    const { role } = req.body

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be "user" or "admin"' })
    }

    await db.execute(
      'UPDATE user_profiles SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [role, userId]
    )

    res.json({ message: 'User role updated successfully' })
  } catch (error) {
    console.error('Update user role error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Ban/Unban user (admin only)
exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params
    const { status } = req.body

    // For now, we'll use a simple approach
    // In a real app, you might have a separate banned_users table
    const isBanned = status === 'banned'

    await db.execute(
      'UPDATE user_profiles SET is_banned = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [isBanned, userId]
    )

    res.json({ 
      message: `User ${isBanned ? 'banned' : 'unbanned'} successfully` 
    })
  } catch (error) {
    console.error('Toggle user status error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get all listings (admin only)
exports.getAllListings = async (req, res) => {
  try {
    const [listings] = await db.execute(
      `SELECT 
        l.*,
        u.name as seller_name,
        u.email as seller_email,
        (SELECT COUNT(*) FROM swap_history WHERE listing_id = l.id) as swap_count
       FROM listings l
       LEFT JOIN user_profiles u ON l.user_id = u.id
       ORDER BY l.created_at DESC`
    )

    res.json(listings)
  } catch (error) {
    console.error('Get all listings error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Update listing status (admin only)
exports.updateListingStatus = async (req, res) => {
  try {
    const { listingId } = req.params
    const { status } = req.body

    if (!['pending', 'approved', 'rejected', 'spam'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be "pending", "approved", "rejected", or "spam"' 
      })
    }

    await db.execute(
      'UPDATE listings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, listingId]
    )

    res.json({ message: 'Listing status updated successfully' })
  } catch (error) {
    console.error('Update listing status error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get all swaps (admin only)
exports.getAllSwaps = async (req, res) => {
  try {
    const [swaps] = await db.execute(
      `SELECT 
        sh.*,
        sender.name as sender_name,
        sender.email as sender_email,
        receiver.name as receiver_name,
        receiver.email as receiver_email,
        l.title as item_title,
        l.image_url as item_image
       FROM swap_history sh
       LEFT JOIN user_profiles sender ON sh.sender_id = sender.id
       LEFT JOIN user_profiles receiver ON sh.receiver_id = receiver.id
       LEFT JOIN listings l ON sh.listing_id = l.id
       ORDER BY sh.created_at DESC`
    )

    res.json(swaps)
  } catch (error) {
    console.error('Get all swaps error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Update swap status (admin only)
exports.updateSwapStatus = async (req, res) => {
  try {
    const { swapId } = req.params
    const { status } = req.body

    if (!['pending', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be "pending", "completed", or "cancelled"' 
      })
    }

    await db.execute(
      'UPDATE swap_history SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, swapId]
    )

    res.json({ message: 'Swap status updated successfully' })
  } catch (error) {
    console.error('Update swap status error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get admin dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total users
    const [userCount] = await db.execute('SELECT COUNT(*) as count FROM user_profiles')
    
    // Get total listings
    const [listingCount] = await db.execute('SELECT COUNT(*) as count FROM listings')
    
    // Get total swaps
    const [swapCount] = await db.execute('SELECT COUNT(*) as count FROM swap_history')
    
    // Get pending listings
    const [pendingListings] = await db.execute(
      'SELECT COUNT(*) as count FROM listings WHERE status = "pending"'
    )

    // Get recent activity
    const [recentUsers] = await db.execute(
      'SELECT COUNT(*) as count FROM user_profiles WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    )

    const [recentListings] = await db.execute(
      'SELECT COUNT(*) as count FROM listings WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    )

    res.json({
      totalUsers: userCount[0].count,
      totalListings: listingCount[0].count,
      totalSwaps: swapCount[0].count,
      pendingListings: pendingListings[0].count,
      recentUsers: recentUsers[0].count,
      recentListings: recentListings[0].count
    })
  } catch (error) {
    console.error('Get dashboard stats error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
} 