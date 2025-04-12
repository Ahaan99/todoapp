import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { 
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo
} from '../controllers/todo.controller.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getTodos).post(createTodo);
router.route('/:id').put(updateTodo).delete(deleteTodo);

export default router;
