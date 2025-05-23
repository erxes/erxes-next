import { Router } from 'express';
import { router as organizationRoutes } from '~/modules/organization/routes';
import { router as fileRoutes } from '~/routes/fileRoutes';

const router: Router = Router();

router.use(organizationRoutes);
router.use(fileRoutes);

export { router };
