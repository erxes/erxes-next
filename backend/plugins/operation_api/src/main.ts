import { redis, startPlugin } from 'erxes-api-shared/utils';
import { typeDefs } from '~/apollo/typeDefs';
import resolvers from './apollo/resolvers';
import { generateModels } from './connectionResolvers';
import { Router } from 'express';
import { initMQWorkers } from '~/worker';
import {
  getCycleProgressByMember,
  getCycleProgressByProject,
} from '~/modules/cycle/utils';
import { getCycleProgressChart } from '~/modules/cycle/utils';
import { getCyclesProgress } from '~/modules/cycle/utils';
export const router: Router = Router();

router.get('/endCycle', async (req, res) => {
  const cycleIds = ['68c7b3dc71837212b43c7007', '68c7b3dc71837212b43c7008'];
  const models = await generateModels('os');

  try {
    await Promise.all(
      cycleIds.map(async (cycleId) => {
        const chartData = await getCycleProgressChart(
          cycleId,
          undefined,
          models,
        );
        const progress = await getCyclesProgress(cycleId, undefined, models);
        const progressByMember = await getCycleProgressByMember(
          cycleId,
          undefined,
          models,
        );
        const progressByProject = await getCycleProgressByProject(
          cycleId,
          undefined,
          models,
        );

        const statistics = {
          chartData,
          progress,
          progressByMember,
          progressByProject,
        };

        await models.Cycle.findOneAndUpdate(
          { _id: cycleId },
          { $set: { isCompleted: true, isActive: false, statistics } },
          { new: true },
        );
      }),
    );

    res.json({ message: 'Cycles ended successfully' });
  } catch (err) {
    console.error('Error ending cycles:', err);
    res
      .status(500)
      .json({ message: 'Failed to end cycles', error: err.message });
  }
});

startPlugin({
  name: 'operation',
  port: 3306,
  graphql: async () => ({
    typeDefs: await typeDefs(),
    resolvers,
  }),
  hasSubscriptions: true,
  subscriptionPluginPath: require('path').resolve(
    __dirname,
    'apollo',
    process.env.NODE_ENV === 'production'
      ? 'subscription.js'
      : 'subscription.ts',
  ),
  apolloServerContext: async (subdomain, context) => {
    const models = await generateModels(subdomain);

    context.models = models;

    return context;
  },
  onServerInit: async () => {
    await initMQWorkers(redis);
  },

  expressRouter: router,

  meta: {
    notificationModules: [
      {
        name: 'tasks',
        description: 'Tasks',
        icon: 'IconChecklist',
        types: [
          { name: 'taskAssignee', text: 'Task assignee' },
          { name: 'taskStatus', text: 'Task status changed' },
        ],
      },
      {
        name: 'projects',
        description: 'Projects',
        icon: 'IconClipboard',
        types: [
          { name: 'projectAssignee', text: 'Project assignee' },
          { name: 'projectStatus', text: 'Project status changed' },
        ],
      },
      {
        name: 'note',
        description: 'Note',
        icon: 'IconNote',
        types: [{ name: 'note', text: 'Mentioned in note' }],
      },
    ],
  },
});
