const express = require('express')
const router = express.Router()
const multer = require('multer')
const { authMiddleware } = require('../middleware/authMiddleware')
const {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  getUserListings,
  getCategories,
  getConditions
} = require('../controllers/listingController')

// Configure multer for listing image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/listings/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'listing-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
  }
})

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
})

// Public routes (no auth required)
router.get('/', getAllListings)
router.get('/categories', getCategories)
router.get('/conditions', getConditions)
router.get('/:id', getListingById)

// Protected routes (auth required)
router.use(authMiddleware)

router.post('/', upload.single('image'), createListing)
router.put('/:id', updateListing)
router.delete('/:id', deleteListing)
router.get('/user/:userId', getUserListings)

module.exports = router 