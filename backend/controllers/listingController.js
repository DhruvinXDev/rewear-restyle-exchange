const db = require('../db/db')
const { v4: uuidv4 } = require('uuid')

// Create new listing
exports.createListing = async (req, res) => {
  try {
    const { title, description, category, type, size, condition, tags, location, points } = req.body
    const userId = req.user.id
    const listingId = uuidv4()

    // Default points if not provided
    const listingPoints = points || 10

    // Handle image upload (for now, we'll store image URLs)
    // In a real app, you'd upload to cloud storage
    const imageUrl = req.file ? `/uploads/listings/${req.file.filename}` : null

    await db.execute(
      `INSERT INTO listings (id, user_id, title, description, image_url, category, \`condition\`, points, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [listingId, userId, title, description, imageUrl, category, condition, listingPoints]
    )

    // Add points to user for creating listing
    await db.execute(
      `UPDATE user_profiles SET points = points + 5 WHERE id = ?`,
      [userId]
    )

    // Add points history
    const pointsHistoryId = uuidv4()
    await db.execute(
      `INSERT INTO points_history (id, user_id, points, action, description)
       VALUES (?, ?, 5, 'listing_created', 'Created new listing: ${title}')`,
      [pointsHistoryId, userId]
    )

    res.status(201).json({
      message: 'Listing created successfully',
      listing: {
        id: listingId,
        title,
        description,
        category,
        condition,
        points: listingPoints,
        status: 'pending'
      }
    })

  } catch (error) {
    console.error('Create listing error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get all listings (with optional filters)
exports.getAllListings = async (req, res) => {
  try {
    const { category, status, userId } = req.query
    let query = `
      SELECT 
        l.*,
        u.name as seller_name,
        u.avatar_url as seller_avatar
      FROM listings l
      LEFT JOIN user_profiles u ON l.user_id = u.id
      WHERE 1=1
    `
    const params = []

    if (category) {
      query += ' AND l.category = ?'
      params.push(category)
    }

    if (status) {
      query += ' AND l.status = ?'
      params.push(status)
    }

    if (userId) {
      query += ' AND l.user_id = ?'
      params.push(userId)
    }

    query += ' ORDER BY l.created_at DESC'

    const [listings] = await db.execute(query, params)
    res.json(listings)

  } catch (error) {
    console.error('Get listings error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get listing by ID
exports.getListingById = async (req, res) => {
  try {
    const { id } = req.params

    const [listings] = await db.execute(
      `SELECT 
        l.*,
        u.name as seller_name,
        u.avatar_url as seller_avatar,
        u.points as seller_points
       FROM listings l
       LEFT JOIN user_profiles u ON l.user_id = u.id
       WHERE l.id = ?`,
      [id]
    )

    if (listings.length === 0) {
      return res.status(404).json({ error: 'Listing not found' })
    }

    res.json(listings[0])

  } catch (error) {
    console.error('Get listing error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Update listing
exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, category, condition, points } = req.body
    const userId = req.user.id

    // Check if listing exists and belongs to user
    const [existingListings] = await db.execute(
      'SELECT * FROM listings WHERE id = ? AND user_id = ?',
      [id, userId]
    )

    if (existingListings.length === 0) {
      return res.status(404).json({ error: 'Listing not found or access denied' })
    }

    // Update listing
    await db.execute(
      `UPDATE listings 
       SET title = ?, description = ?, category = ?, \`condition\` = ?, points = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, description, category, condition, points, id]
    )

    res.json({ message: 'Listing updated successfully' })

  } catch (error) {
    console.error('Update listing error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Delete listing
exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    // Check if listing exists and belongs to user
    const [existingListings] = await db.execute(
      'SELECT * FROM listings WHERE id = ? AND user_id = ?',
      [id, userId]
    )

    if (existingListings.length === 0) {
      return res.status(404).json({ error: 'Listing not found or access denied' })
    }

    // Delete listing
    await db.execute('DELETE FROM listings WHERE id = ?', [id])

    res.json({ message: 'Listing deleted successfully' })

  } catch (error) {
    console.error('Delete listing error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get user's listings
exports.getUserListings = async (req, res) => {
  try {
    const { userId } = req.params

    const [listings] = await db.execute(
      `SELECT 
        l.*,
        u.name as seller_name,
        u.avatar_url as seller_avatar
       FROM listings l
       LEFT JOIN user_profiles u ON l.user_id = u.id
       WHERE l.user_id = ?
       ORDER BY l.created_at DESC`,
      [userId]
    )

    res.json(listings)

  } catch (error) {
    console.error('Get user listings error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get listing categories
exports.getCategories = async (req, res) => {
  try {
    const categories = [
      'Tops',
      'Bottoms', 
      'Dresses',
      'Jackets',
      'Sweaters',
      'Accessories',
      'Shoes',
      'Bags',
      'Jewelry',
      'Other'
    ]

    res.json(categories)

  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get listing conditions
exports.getConditions = async (req, res) => {
  try {
    const conditions = [
      'New',
      'Like New',
      'Good',
      'Fair',
      'Used'
    ]

    res.json(conditions)

  } catch (error) {
    console.error('Get conditions error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
} 