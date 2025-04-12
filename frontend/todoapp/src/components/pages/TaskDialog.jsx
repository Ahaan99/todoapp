import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TaskForm from './TaskForm';

export const TaskDialog = ({ open, onOpenChange, onSubmit, editTask }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editTask ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>
        <TaskForm
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          initialData={editTask}
        />
      </DialogContent>
    </Dialog>
  );
};
