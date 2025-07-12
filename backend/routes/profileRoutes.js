const express = require('express')
const router = express.Router()
const multer = require('multer')
const { authMiddleware } = require('../middleware/authMiddleware')
const {
  getUserProfile,
  updateUserProfile,
  getSwapHistory,
  getPointsHistory,
  addPoints,
  uploadAvatar
} = require('../controllers/profileController')

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
  }
})

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
})

// All routes require authentication
router.use(authMiddleware)

// Profile routes
router.get('/user/:id', getUserProfile)
router.put('/user/:id', updateUserProfile)

// Swap history
router.get('/user/:id/swaps', getSwapHistory)

// Points routes
router.get('/user/:id/points', getPointsHistory)
router.post('/user/:id/points', addPoints)

// Avatar upload
router.post('/user/:id/avatar', upload.single('avatar'), uploadAvatar)

module.exports = router 