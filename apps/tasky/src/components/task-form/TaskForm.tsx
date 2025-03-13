import React, { useState, useEffect } from 'react';

import { Task } from '../../types/Task';
import './TaskForm.css';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingTask: Task | null;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  editingTask,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [status, setStatus] = useState<Task['status']>('todo');

  // Update form when editing task changes
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setPriority(editingTask.priority);
      setStatus(editingTask.status);
    } else {
      resetForm();
    }
  }, [editingTask]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setStatus('todo');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      priority,
      status,
    });

    if (!editingTask) {
      resetForm();
    }
  };

  return (
    <div className='task-form-container'>
      <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
      <form onSubmit={handleSubmit} className='task-form'>
        <div className='form-group'>
          <label htmlFor='title'>Title</label>
          <input
            type='text'
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Enter task title'
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='description'>Description</label>
          <textarea
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Enter task description'
            rows={3}
          />
        </div>

        <div className='form-row'>
          <div className='form-group'>
            <label htmlFor='priority'>Priority</label>
            <select
              id='priority'
              value={priority}
              onChange={(e) => setPriority(e.target.value as Task['priority'])}
            >
              <option value='low'>Low</option>
              <option value='medium'>Medium</option>
              <option value='high'>High</option>
            </select>
          </div>

          <div className='form-group'>
            <label htmlFor='status'>Status</label>
            <select
              id='status'
              value={status}
              onChange={(e) => setStatus(e.target.value as Task['status'])}
            >
              <option value='todo'>To Do</option>
              <option value='in-progress'>In Progress</option>
              <option value='completed'>Completed</option>
            </select>
          </div>
        </div>

        <div className='form-actions'>
          {editingTask && (
            <button type='button' className='cancel-button' onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type='submit' className='submit-button'>
            {editingTask ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};
