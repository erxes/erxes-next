import { Router, Request, Response } from 'express';
import { getEnv, getSubdomain } from 'erxes-api-shared/utils';
import { generateModels } from '~/connectionResolvers';
import { getSaasOrganizationDetail } from 'erxes-api-shared/utils';
import { magiclinkCallback, ssocallback } from '~/utils/saas';

const router: Router = Router();

router.get('/initial-setup', async (req: Request, res: Response) => {
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

    organizationInfo.type = 'saas';
  }

  const userCount = await models.Users.countDocuments({
    isOwner: true,
  });

  if (userCount === 0) {
    organizationInfo.hasOwner = false;
  } else {
    organizationInfo.hasOwner = true;
  }

  return res.json(organizationInfo);
});

router.get('/get-frontend-plugins', async (_req: Request, res: Response) => {
  const ENABLED_PLUGINS = getEnv({ name: 'ENABLED_PLUGINS' });

  const remotes: { name: string; entry: string }[] = [];

  if (ENABLED_PLUGINS) {
    ENABLED_PLUGINS.split(',').forEach((plugin) => {
      remotes.push({
        name: `${plugin}_ui`,
        entry: `https://plugins.erxes.io/latest/${plugin}_ui/remoteEntry.js`,
      });
    });
  }

  return res.json(remotes);
});

router.get('/sso-callback', ssocallback);
router.get('/ml-callback', magiclinkCallback);

export { router };
