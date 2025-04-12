import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'completed'],
    default: 'todo'
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'fitness', 'shopping', 'other'],
    default: 'other'
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Todo = mongoose.model('Todo', todoSchema);
export default Todo;
