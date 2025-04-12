import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiX, FiCheck } from 'react-icons/fi';

const categories = [
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'other', label: 'Other' }
];

const TaskForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [task, setTask] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'work',
    dueDate: initialData?.dueDate?.split('T')[0] || new Date().toISOString().split('T')[0],
    status: initialData?.status || 'todo'
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(task);
    }} className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium mb-1">Task Title</label>
        <Input
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          placeholder="Enter task title"
          className="w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          className="w-full min-h-[100px] rounded-md border p-2"
          placeholder="Enter task description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={task.category}
            onChange={(e) => setTask({ ...task, category: e.target.value })}
            className="w-full rounded-md border p-2"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <Input
            type="date"
            value={task.dueDate}
            onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
            className="w-full"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={task.status}
          onChange={(e) => setTask({ ...task, status: e.target.value })}
          className="w-full rounded-md border p-2"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          <FiX className="mr-2" /> Cancel
        </Button>
        <Button type="submit">
          <FiCheck className="mr-2" /> {initialData ? 'Update' : 'Add'} Task
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
