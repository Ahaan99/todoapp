import Todo from '../models/todo.model.js';

export const createTodo = async (req, res) => {
  try {
    const { title, description, category, dueDate, status } = req.body;
    
    const todo = await Todo.create({
      title,
      description,
      category,
      dueDate,
      status,
      user: req.user._id
    });
    
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ 
      message: error.message,
      errors: Object.keys(error.errors || {}).reduce((acc, key) => {
        acc[key] = error.errors[key].message;
        return acc;
      }, {})
    });
  }
};

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id });
    res.json(todos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
