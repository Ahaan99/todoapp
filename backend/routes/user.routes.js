import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { updateProfile, getMetrics } from '../controllers/user.controller.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.use(protect);

// Add error handling wrapper for file upload
router.put('/profile', (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err) {
      console.error('Upload middleware error:', err);
      return res.status(400).json({ 
        message: err.message || 'Error uploading file',
        code: err.code 
      });
    }
    next();
  });
}, updateProfile);

router.get('/metrics', getMetrics);

export default router;
