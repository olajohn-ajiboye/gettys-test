import React from 'react';
import { Task } from '../../types/Task';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onDelete,
  onEdit,
  onStatusChange,
}) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Task['status'];
    onStatusChange(task.id, newStatus);
  };

  // Format dates
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className={`task-item priority-${task.priority}`}>
      <h3 className='task-title'>{task.title}</h3>
      {task.description && (
        <p className='task-description'>{task.description}</p>
      )}

      <div className='task-meta'>
        <div className='task-priority'>
          Priority:{' '}
          <span className={`priority-label ${task.priority}`}>
            {task.priority}
          </span>
        </div>
        <div className='task-dates'>
          <div>Created: {formatDate(task.createdAt)}</div>
          <div>Updated: {formatDate(task.updatedAt)}</div>
        </div>
      </div>

      <div className='task-actions'>
        <select
          value={task.status}
          onChange={handleStatusChange}
          className='status-select'
        >
          <option value='todo'>To Do</option>
          <option value='in-progress'>In Progress</option>
          <option value='completed'>Completed</option>
        </select>

        <button className='edit-button' onClick={() => onEdit(task)}>
          Edit
        </button>

        <button className='delete-button' onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};
