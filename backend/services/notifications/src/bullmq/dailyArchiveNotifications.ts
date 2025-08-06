import { generateModels } from '@/connectionResolver';
import { getEnv, getSaasOrganizations } from 'erxes-api-shared/utils';

export const dailyArchiveNotification = async () => {
  const VERSION = getEnv({ name: 'VERSION' });

  if (VERSION === 'saas') {
    const orgs = await getSaasOrganizations();

    for (const org of orgs) {
      archiveNotifications(org.subdomain);
    }
    return 'success';
  }
  archiveNotifications('os');
};

const archiveNotifications = async (subdomain: string) => {
  const models = await generateModels(subdomain);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // today at 00:00
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  ); // tomorrow at 00:00

  await models.Notifications.updateMany(
    {
      expiresAt: {
        $gte: today,
        $lt: tomorrow,
      },
      isArchived: { $ne: true },
    },
    {
      $set: { isArchived: true },
    },
  );
};
