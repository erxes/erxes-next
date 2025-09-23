import { Job } from 'bullmq';
import { endOfDay } from 'date-fns'; // эсвэл өөр utility
import {
  getEnv,
  getSaasOrganizations,
  sendWorkerQueue,
} from 'erxes-api-shared/utils';
import { generateModels } from '~/connectionResolvers';

export const dailyCheckCycles = async () => {
  console.log('daily check cycles is worked');
  const VERSION = getEnv({ name: 'VERSION' });

  if (VERSION && VERSION === 'saas') {
    const orgs = await getSaasOrganizations();

    for (const org of orgs) {
      if (org.enabledcycles) {
        sendWorkerQueue('operations', 'endCycle').add('endCycle', {
          subdomain: org.subdomain,
        });
      }
    }

    return 'success';
  } else {
    sendWorkerQueue('operations', 'endCycle').add('endCycle', {
      subdomain: 'os',
    });
    return 'success';
  }
};

export const endCycle = async (job: Job) => {
  const { subdomain } = job?.data ?? {};

  console.log('daily check cycles is worked', subdomain);
  const models = await generateModels(subdomain);

  const today = new Date();

  const cycles = await models.Cycle.find({
    isActive: true,
    isCompleted: false,
    endDate: {
      $lte: endOfDay(today),
    },
  });

  console.log('cycles.length', cycles.length);

  if (!cycles || cycles.length === 0) return;

  console.log('cycles', cycles);

  for (const cycle of cycles) {
    await models.Cycle.endCycle(cycle?._id);
  }
};
