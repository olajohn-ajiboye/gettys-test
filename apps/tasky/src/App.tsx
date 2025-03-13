import React, { useState, useEffect } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from './api/tasks';
import { Task } from './types/Task';
import {TaskList} from './components/task-list/TaskList';
import {TaskForm} from './components/task-form/TaskForm';
import './App.css';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const taskData = await fetchTasks();
        setTasks(taskData);
        setError(null);
      } catch (err) {
        setError('Failed to load tasks. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
   
  }, []);

    console.log(tasks);

  const handleCreateTask = async (
    taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const newTask = await createTask(taskData);
      setTasks([...tasks, newTask]);
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    }
  };

  const handleUpdateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      const updatedTask = await updateTask(id, taskData);
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
      setEditingTask(null);
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className='app-container'>
      <header>
        <h1>Task Manager</h1>
      </header>

      {error && <div className='error-message'>{error}</div>}

      <TaskForm
        onSubmit={
          editingTask
            ? (data) => handleUpdateTask(editingTask.id, data)
            : handleCreateTask
        }
        editingTask={editingTask}
        onCancel={handleCancelEdit}
      />

      {loading ? (
        <div className='loading'>Loading tasks...</div>
      ) : (
        <TaskList
          tasks={tasks}
          onDelete={handleDeleteTask}
          onEdit={handleEditTask}
          onStatusChange={(id, status) => handleUpdateTask(id, { status })}
        />
      )}
    </div>
  );
};

export default App;


