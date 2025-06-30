import { Router } from 'express';
import { router as facebookRouter } from './modules/integrations/facebook/routes';
import { router as callRouter } from './modules/integrations/call/routes';

export const router: Router = Router();

router.use('/facebook', facebookRouter);
router.use('/call', callRouter);
