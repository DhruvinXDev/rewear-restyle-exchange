const express = require('express')
const router = express.Router()
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware')
const {
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  getAllListings,
  updateListingStatus,
  getAllSwaps,
  updateSwapStatus,
  getDashboardStats
} = require('../controllers/adminController')

// All admin routes require authentication and admin role
router.use(authMiddleware)
router.use(adminMiddleware)

// Dashboard stats
router.get('/stats', getDashboardStats)

// User management
router.get('/users', getAllUsers)
router.put('/users/:userId/role', updateUserRole)
router.put('/users/:userId/status', toggleUserStatus)

// Listing management
router.get('/listings', getAllListings)
router.put('/listings/:listingId/status', updateListingStatus)

// Swap management
router.get('/swaps', getAllSwaps)
router.put('/swaps/:swapId/status', updateSwapStatus)

module.exports = router 