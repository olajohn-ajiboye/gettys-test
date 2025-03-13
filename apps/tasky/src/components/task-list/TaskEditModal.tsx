import React, { useState, useEffect } from 'react';

import { Task } from '../../types/Task';



export interface TaskEditModalProps {
  task: Task;
  onSubmit: (task: Task) => void;
  onClose: () => void;
}

export const TaskEditModal: React.FC<TaskEditModalProps> = ({
  task,
  onSubmit,
  onClose,
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState<Task['priority']>(task.priority);
  const [status, setStatus] = useState<Task['status']>(task.status);

  // Handle click outside modal to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('modal-overlay')) {
        onClose();
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [onClose]);

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...task,
      title,
      description,
      priority,
      status,
      updatedAt: new Date(),
    });
  };

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <div className='modal-header'>
          <h2>Edit Task</h2>
          <button className='close-button' onClick={onClose}>
            ×
          </button>
        </div>
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
                onChange={(e) =>
                  setPriority(e.target.value as Task['priority'])
                }
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
            <button type='button' className='cancel-button' onClick={onClose}>
              Cancel
            </button>
            <button type='submit' className='submit-button'>
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
