import { Router } from 'express';
import { router as coreRoutes } from './modules/organization/organization/routes';

const router = Router();

router.use(coreRoutes);

export { router };
