import express from 'express';
import { v4 as uuidv4 } from 'uuid';

import { Task } from '../interfaces/Tasks';

const router = express.Router();




// Simple in-memory storage
let tasks: Task[] = [];

router.get<{}, Task[]>('/', (req, res) => {
  res.json(tasks);
});


router.get<{ id: string }, Task | { error: string }>('/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});


router.post<{}, Task | { error: string }>('/', (req, res) => {
  const { title, description, priority = 'medium', status = 'todo' } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask: Task = {
    id: uuidv4(),
    title,
    description: description || '',
    status: status,
    priority: priority,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});


router.put<{ id: string }, Task | { error: string }>('/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, description, status, priority } = req.body;

  if (title !== undefined && title.trim() === '') {
    return res.status(400).json({ error: 'Title cannot be empty' });
  }

  // Update task
  const updatedTask = {
    ...tasks[taskIndex],
    title: title ?? tasks[taskIndex].title,
    description: description ?? tasks[taskIndex].description,
    status: status ?? tasks[taskIndex].status,
    priority: priority ?? tasks[taskIndex].priority,
    updatedAt: new Date(),
  };

  tasks[taskIndex] = updatedTask;
  res.json(updatedTask);
});

router.delete<{ id: string }, Task | { error: string }>('/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks = tasks.filter(t => t.id !== req.params.id);
  res.status(204).send();

});



export default router;
