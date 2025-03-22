const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {getCategory, getAllCategories, updateCategory, createCategory, deleteCategory} = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');


// Set up multer storage for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/categories');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'category-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.webp') {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file size limit
    }
});

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategory);

// Protected routes (admin only)
router.post('/',
    protect, adminOnly,
    upload.single('image'),createCategory
);

router.put('/:id',
    protect, adminOnly,
    upload.single('image'), updateCategory
);

router.delete('/:id',
    protect, adminOnly, deleteCategory
);

module.exports = router;