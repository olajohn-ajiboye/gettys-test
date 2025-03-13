import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import tasks from './tasks';


const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/tasks', tasks);


export default router;
