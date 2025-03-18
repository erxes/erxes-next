import { Router } from 'express';
import { router as coreRoutes } from './modules/core/routes';

const router = Router();

router.use(coreRoutes);

export { router };
