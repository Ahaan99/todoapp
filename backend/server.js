import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure environment variables are loaded first
const result = dotenv.config({ path: path.join(__dirname, '.env') });
if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
}

// Validate critical environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'CLOUDINARY_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'JWT_SECRET'
];

for (const envVar of requiredEnvVars) {
  const value = process.env[envVar];
  if (!value) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
  console.log(`${envVar}: ${value ? '✓' : '✗'}`);
}

// Now import other modules after env vars are loaded
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import todoRoutes from './routes/todo.routes.js';
import userRoutes from './routes/user.routes.js';
import { MulterError } from 'multer';

const app = express(); // Move app creation here

// Debug environment variables
console.log('Environment validation passed');
console.log('Environment variables loaded:', {
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : undefined,
  NODE_ENV: process.env.NODE_ENV
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes);

// MongoDB connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority'
};

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

// Initialize database connection
connectDB();

// Start server only after successful DB connection
mongoose.connection.once('open', () => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Add this before the general error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Max size is 5MB' });
    }
    return res.status(400).json({ message: 'File upload error' });
  }
  next(err);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    code: err.code,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
  
  if (err instanceof MulterError) {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  
  res.status(err.status || 500).json({ 
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});
