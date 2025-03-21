import { Router, Request, Response } from 'express';
import { getEnv, getSubdomain } from 'erxes-api-utils';
import { generateModels } from '../../connectionResolvers';
import { getSaasOrganizationDetail } from 'erxes-api-utils';
const router = Router();

router.get('/v3/initial-setup', async (req: Request, res: Response) => {
  const subdomain = getSubdomain(req);
  const models = await generateModels(subdomain);

  const VERSION = getEnv({ name: 'VERSION', defaultValue: 'os' });

  if (VERSION && VERSION === 'saas') {
    const organizationInfo = await getSaasOrganizationDetail({
      subdomain,
      models,
    });

    return res.send(organizationInfo);
  }

  const organizationInfo = {
    type: 'os',
    config: {},
  };

  return res.send(organizationInfo);
});

export { router };
