import { Router, Request, Response } from 'express';
import { getEnv, getSubdomain } from 'erxes-api-utils';
import { generateModels } from '../../connectionResolvers';
import { getSaasOrganizationDetail } from 'erxes-api-utils';

const router = Router();

router.get('/v3/initial-setup', async (req: Request, res: Response) => {
  const subdomain = getSubdomain(req);
  const models = await generateModels(subdomain);

  let organizationInfo = {
    type: 'os',
    config: {},
    hasOwner: false,
  };

  const VERSION = getEnv({ name: 'VERSION', defaultValue: 'os' });

  if (VERSION && VERSION === 'saas') {
    organizationInfo = await getSaasOrganizationDetail({
      subdomain,
      models,
    });
  }

  const userCount = await models.Users.countDocuments();
  if (userCount === 0) {
    organizationInfo.hasOwner = false;
  } else {
    organizationInfo.hasOwner = true;
  }

  return res.json(organizationInfo);
});

export { router };
