const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); 
const { register, login, getUserById, getAllUsers,updateUser,updateUsers, updateProfile, deleteUser } = require('../controllers/userController');
const { validateRegistration, validateLogin } = require('../middleware/validationMiddleware');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const User=  require ('../models/User');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid image file type. Only JPG, PNG and WebP are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

router.get('/profile', protect, async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/:id', protect, getUserById);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);
router.get('/', protect, adminOnly, getAllUsers);
router.get('/favorites/:userId', protect, getUserById);

// Add this route before other routes

module.exports = router;