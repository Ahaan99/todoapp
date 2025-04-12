import User from '../models/user.model.js';
import Todo from '../models/todo.model.js';
import { cloudinary } from '../config/cloudinary.js';

export const updateProfile = async (req, res) => {
  try {
    const updates = {};
    
    // Handle file upload if present
    if (req.file) {
      const fileStr = req.file.buffer.toString('base64');
      const fileUri = `data:${req.file.mimetype};base64,${fileStr}`;
      
      const uploadResult = await cloudinary.uploader.upload(fileUri, {
        folder: 'todo-app-avatars',
        transformation: [{ width: 300, height: 300, crop: 'fill' }]
      });
      
      updates.avatar = uploadResult.secure_url;
    }

    // Handle other profile updates
    const allowedUpdates = ['username', 'email', 'bio', 'phoneNumber'];
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key) && req.body[key]) {
        updates[key] = req.body[key];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      ...updatedUser.toObject(),
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
};

export const getMetrics = async (req, res) => {
  try {
    console.log('Fetching metrics for user:', req.user._id);
    
    const [user, todos] = await Promise.all([
      User.findById(req.user._id),
      Todo.find({ user: req.user._id })
    ]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const completedTodos = todos.filter(todo => todo.status === 'completed');
    const completionRate = todos.length > 0 
      ? Math.round((completedTodos.length / todos.length) * 100)
      : 0;

    // Group tasks by date to calculate streak
    const tasksByDate = completedTodos.reduce((acc, todo) => {
      const date = new Date(todo.updatedAt).toDateString();
      acc[date] = true;
      return acc;
    }, {});

    const metrics = {
      tasksCompleted: completedTodos.length,
      totalTasksCreated: todos.length,
      completionRate,
      streakDays: Object.keys(tasksByDate).length,
      efficiencyScore: calculateEfficiencyScore(todos)
    };

    console.log('Metrics calculated:', metrics);
    res.json(metrics);
    
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ 
      message: 'Failed to fetch metrics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const calculateEfficiencyScore = (todos) => {
  if (todos.length === 0) return 0;
  
  const completedOnTime = todos.filter(todo => 
    todo.status === 'completed' && 
    new Date(todo.updatedAt) <= new Date(todo.dueDate)
  ).length;
  
  return Math.round((completedOnTime / todos.length) * 100);
};
