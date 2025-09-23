import { Job } from 'bullmq';
import { addDays, endOfDay, startOfDay } from 'date-fns'; // эсвэл өөр utility
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
        sendWorkerQueue('operations', 'checkCycle').add('checkCycle', {
          subdomain: org.subdomain,
        });
      }
    }

    return 'success';
  } else {
    sendWorkerQueue('operations', 'checkCycle').add('checkCycle', {
      subdomain: 'os',
    });
    return 'success';
  }
};

export const checkCycle = async (job: Job) => {
  const { subdomain } = job?.data ?? {};

  console.log('daily check cycles is worked', subdomain);
  const models = await generateModels(subdomain);

  const today = new Date();

  const endCycles = await models.Cycle.find({
    isActive: true,
    isCompleted: false,
    endDate: {
      $lte: startOfDay(addDays(today, 1)),
    },
  });

  if (endCycles?.length) {
    for (const cycle of endCycles) {
      await models.Cycle.endCycle(cycle?._id);
    }
  }

  const startCycles = await models.Cycle.find({
    isActive: false,
    isCompleted: false,
    startDate: {
      $lte: endOfDay(today),
    },
  });

  if (startCycles?.length) {
    for (const cycle of startCycles) {
      await models.Cycle.startCycle(cycle?._id);
    }
  }
};
