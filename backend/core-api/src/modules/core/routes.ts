import { Router, Request, Response } from 'express';
import { getSubdomain } from 'erxes-api-utils';
import { generateModels } from '../../connectionResolvers';

const router = Router();

router.get('/v3/initial-setup', async (req: Request, res: Response) => {
  const subdomain = getSubdomain(req);
  const models = await generateModels(subdomain);

  console.log(models);
  res.send('initial setup');
});

export { router };
