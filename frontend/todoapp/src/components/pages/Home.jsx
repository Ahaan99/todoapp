import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FiPlus, FiTrash2, FiCheck, FiUser, FiList, FiCheckCircle, FiEdit2 } from 'react-icons/fi';
import Header from './Header';
import { useAuth } from '@/context/AuthContext';
import Login from './Login';
import Signup from './Signup';
import FilterBar from './FilterBar';
import axios from 'axios';
import TaskForm from './TaskForm';
import { TaskDialog } from './TaskDialog';

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [newCategory, setNewCategory] = useState('other');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/todos', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (taskData) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/todos', {
        ...taskData,
        status: 'todo'
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTodos([...todos, data]);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (todo) => {
    try {
      const { data } = await axios.put(`http://localhost:5000/api/todos/${todo._id}`, {
        completed: !todo.completed
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTodos(todos.map(t => t._id === data._id ? data : t));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const updateTaskStatus = async (todo, status) => {
    try {
      const { data } = await axios.put(`http://localhost:5000/api/todos/${todo._id}`, {
        status
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTodos(todos.map(t => t._id === data._id ? data : t));
      
      // Dispatch event when task is completed
      if (status === 'completed') {
        window.dispatchEvent(new CustomEvent('taskStatusChanged', {
          detail: { type: 'completed', taskId: todo._id }
        }));
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${todoId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTodos(todos.filter(t => t._id !== todoId));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setTodos([]);
  };

  const handleTaskSubmit = async (taskData) => {
    try {
      const formattedData = {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString()
      };

      if (editingTask) {
        const { data } = await axios.put(
          `http://localhost:5000/api/todos/${editingTask._id}`,
          formattedData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setTodos(todos.map(t => t._id === data._id ? data : t));
      } else {
        const { data } = await axios.post(
          'http://localhost:5000/api/todos',
          formattedData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setTodos([...todos, data]);
      }
      setTaskDialogOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error saving todo:', error.response?.data?.message || error.message);
      // You might want to show this error to the user
    }
  };

  // Update the completed tasks calculation
  const completedTasks = useMemo(() => {
    return todos.filter(todo => todo.status === 'completed').length;
  }, [todos]);
  
  const totalTasks = todos.length;

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        todo.title?.toLowerCase().includes(searchLower) ||
        todo.description?.toLowerCase().includes(searchLower);
      
      const matchesCategory = selectedCategory === 'all' || todo.category === selectedCategory;
      
      const matchesDate = !dateFilter || 
        new Date(todo.dueDate).toLocaleDateString() === new Date(dateFilter).toLocaleDateString();
      
      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [todos, searchQuery, selectedCategory, dateFilter]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8"
    >
      <div className="max-w-6xl mx-auto">
        <Header 
          isLoggedIn={!!user}
          username={user?.username}
          onLogout={handleLogout}
        />

        {!user ? (
          showLogin ? (
            <Login onSwitchToSignup={() => setShowLogin(false)} />
          ) : (
            <Signup onSwitchToLogin={() => setShowLogin(true)} />
          )
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30 backdrop-blur-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium">Total Tasks</h3>
                    <FiList className="text-white/80" size={20} />
                  </div>
                  <p className="text-3xl font-bold text-white mt-2">{totalTasks}</p>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30 backdrop-blur-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-green-100">Completed</h3>
                    <FiCheckCircle className="text-green-400" size={20} />
                  </div>
                  <p className="text-3xl font-bold text-green-100 mt-2">{completedTasks}</p>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30 backdrop-blur-sm col-span-2">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-purple-100">Completion Rate</h3>
                    <div className="text-purple-100">
                      {Math.round((completedTasks / totalTasks) * 100) || 0}%
                    </div>
                  </div>
                  <div className="w-full bg-purple-950/50 rounded-full h-2 mt-4">
                    <div 
                      className="bg-purple-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(completedTasks / totalTasks) * 100 || 0}%` }}
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Filters and Add Task */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
              <FilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
              />
              
              <Button
                onClick={() => {
                  setEditingTask(null);
                  setTaskDialogOpen(true);
                }}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/20"
              >
                <FiPlus className="mr-2" /> Add New Task
              </Button>
            </div>

            {/* Tasks Grid */}
            <AnimatePresence>
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTodos.map(todo => (
                  <motion.div
                    key={todo._id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-200">
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-lg text-white">{todo.title}</h3>
                          <select
                            value={todo.status}
                            onChange={(e) => updateTaskStatus(todo, e.target.value)}
                            className="bg-slate-700 text-white rounded-md px-2 py-1 text-sm border-none outline-none hover:bg-slate-600"
                          >
                            <option value="todo">Todo</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                        
                        {todo.description && (
                          <p className="text-white/70">{todo.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between pt-4 border-t border-slate-600">
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <span>{new Date(todo.dueDate).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="capitalize px-2 py-1 rounded-full bg-slate-700/50 text-white/80">
                              {todo.category}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="hover:bg-slate-700/50"
                              onClick={() => {
                                setEditingTask(todo);
                                setTaskDialogOpen(true);
                              }}
                            >
                              <FiEdit2 className="text-slate-400 hover:text-white transition-colors" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="hover:bg-red-500/10"
                              onClick={() => deleteTodo(todo._id)}
                            >
                              <FiTrash2 className="text-red-400 hover:text-red-300 transition-colors" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        <TaskDialog 
          open={taskDialogOpen}
          onOpenChange={setTaskDialogOpen}
          onSubmit={handleTaskSubmit}
          editTask={editingTask}
        />
      </div>
    </motion.div>
  );
};

export default Home;