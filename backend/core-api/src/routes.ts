import { Router } from 'express';
import { router as organizationRoutes } from '~/modules/organization/routes';

const router: Router = Router();

router.use(organizationRoutes);

export { router };
