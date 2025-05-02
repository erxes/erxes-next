import express, { Router } from 'express';
import {loginMiddleware} from "@/integrations/facebook/middlewares/loginMiddleware";

export const router: Router = express.Router();

router.get('/recieve', (req, res) => {
  console.log(router.get,'asodpaksdpoaps')
  res.send('Hello World');
});
router.get('/fblogin', async (req, res) => {
  await loginMiddleware(req, res);
  res.send('Facebook login passed');
});
