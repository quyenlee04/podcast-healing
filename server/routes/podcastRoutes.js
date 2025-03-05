const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const podcastController = require('../controllers/podcastController');
const authMiddleware = require('../middleware/authMiddleware');



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, files, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, files.fieldname + '-' + uniqueSuffix + path.extname(files.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, files, cb) => {
    const ext = path.extname(files.originalname).toLowerCase();
    if (ext !== '.mp3' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      return cb(new Error('Only MP3 and image files are allowed'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB file size limit
  }
});

router.post('/create', 
  authMiddleware.protect, 
  upload.fields([
    { name: 'mp3', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  podcastController.createPodcast
);
router.get('/', authMiddleware.protect, podcastController.getPodcast);
router.get('/:id', authMiddleware.protect, podcastController.getSinglePodcast);
router.put('/:id', authMiddleware.protect, podcastController.updatePodcast);
router.delete('/:id', authMiddleware.protect, podcastController.deletePodcast);

router.post('/:id/like', authMiddleware.protect, podcastController.toggleLike);
router.post('/:id/comments', authMiddleware.protect, podcastController.addComment);
router.delete('/:id/comments/:commentId', authMiddleware.protect, podcastController.deleteComment);

module.exports = router;