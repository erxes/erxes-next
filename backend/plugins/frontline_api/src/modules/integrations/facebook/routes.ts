import express, { Router } from 'express';

export const router: Router = express.Router();

router.get('/recieve', (req, res) => {
  res.send('Hello World');
});
