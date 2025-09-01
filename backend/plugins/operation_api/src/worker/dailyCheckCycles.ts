import { generateModels } from '~/connectionResolvers';
import { getEnv, getSaasOrganizations } from 'erxes-api-shared/utils';
import { startOfDay, endOfDay } from 'date-fns'; // эсвэл өөр utility

export const dailyCheckCycles = async () => {
  const VERSION = getEnv({ name: 'VERSION' });

  if (VERSION === 'saas') {
    const orgs = await getSaasOrganizations();

    for (const org of orgs) {
      if (org.enabledcycles) {
        await endCycle(org.subdomain);
      }
    }

    await endCycle('os');

    return 'success';
  }
};

const endCycle = async (subdomain: string) => {
  const models = await generateModels(subdomain);

  const today = new Date();

  const cycle = await models.Cycle.findOne({
    isActive: true,
    isCompleted: false,
    endDate: {
      $gte: startOfDay(today), // 00:00:00
      $lte: endOfDay(today), // 23:59:59.999
    },
  });

  if (!cycle) return;

  await models.Cycle.endCycle(cycle?._id);
};
