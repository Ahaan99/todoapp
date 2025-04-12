import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Ensure environment variables are loaded
dotenv.config();

// Verify credentials before configuration
const credentials = {
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
};

console.log('Configuring Cloudinary with:', {
  cloud_name: credentials.cloud_name,
  api_key: credentials.api_key ? `***${credentials.api_key.slice(-4)}` : undefined,
});

// Configure Cloudinary
cloudinary.config(credentials);

// Test configuration
try {
  const { cloud_name } = cloudinary.config();
  if (!cloud_name) {
    throw new Error('Invalid configuration');
  }
  console.log('✅ Cloudinary configured for cloud:', cloud_name);
} catch (error) {
  console.error('❌ Cloudinary configuration failed:', error);
  throw error;
}

// Setup multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

export { cloudinary, upload };
