import { IContext } from '~/connectionResolvers';
import redis from '../../redlock';
import { XMLParser } from 'fast-xml-parser';
import { ICallHistoryFilterOptions } from '@/integrations/call/@types/histories';
import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { sendToGrandStream } from '~/modules/integrations/call/utils';
import {
  calculateAbandonmentRate,
  calculateAverageHandlingTime,
  calculateAverageSpeedOfAnswer,
  calculateFirstCallResolution,
  calculateServiceLevel,
} from '~/modules/integrations/call/statistics';

const callQueries = {
  async callsIntegrationDetail(_root, { integrationId }, { models }: IContext) {
    return models.CallIntegrations.findOne({ inboxId: integrationId });
  },

  async callUserIntegrations(_root, _args, { models, user }: IContext) {
    const res = models.CallIntegrations.getIntegrations(user._id);

    return res;
  },

  async callsCustomerDetail(_root, { customerPhone }) {
    const customer = await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'customer',
      action: 'findOne',
      input: {
        primaryPhone: customerPhone,
      },
    });

    return customer;
  },

  async callHistories(
    _root,
    params: ICallHistoryFilterOptions,
    { models, user }: IContext,
  ) {
    const activeSession = models.CallHistory.getCallHistories(params, user);

    return activeSession;
  },
  async callHistoriesTotalCount(
    _root,
    params: ICallHistoryFilterOptions,
    { models, user }: IContext,
  ) {
    return models.CallHistory.getHistoriesCount(params, user);
  },

  async callsGetConfigs(_root, _args, { models }: IContext) {
    return models.CallConfigs.find({});
  },

  async callGetAgentStatus(_root, _args, { models, user }: IContext) {
    const operator = await models.CallOperators.findOne({ userId: user._id });
    if (operator) {
      return operator.status;
    }
    return 'UnAvailable';
  },

  async callExtensionList(
    _root,
    { integrationId },
    { models, user }: IContext,
  ) {
    const integration = await models.CallIntegrations.getIntegration(
      user._id,
      integrationId,
    );
    if (!integration) {
      throw new Error('Integration not found');
    }
    const queueData = (await sendToGrandStream(
      models,
      {
        path: 'api',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: {
          request: {
            action: 'listAccount',
            item_num: '50',
            options: 'extension,fullname,status',
            page: '1',
            sidx: 'extension',
            sord: 'asc',
          },
        },
        integrationId: integrationId,
        retryCount: 3,
        isConvertToJson: true,
        isAddExtention: false,
      },
      user,
    )) as any;

    if (queueData && queueData.response) {
      const { account } = queueData.response;

      if (account) {
        const gsUsernames = integration.operators.map(
          (operator) => operator.gsUsername,
        );

        const matchedAgents = account.filter(
          (agent) =>
            gsUsernames.includes(agent.extension) &&
            agent.status !== 'Unavailable',
        );

        return matchedAgents;
      }
      return [];
    }
    return 'request failed';
  },
  async callQueueList(_root, { integrationId }, { models, user }: IContext) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    const integration = await models.CallIntegrations.getIntegration(
      user._id,
      integrationId,
    );
    if (!integration) {
      throw new Error('Integration not found');
    }
    const queueData = (await sendToGrandStream(
      models,
      {
        path: 'api',
        method: 'POST',
        data: {
          request: {
            action: 'queueapi',
            startTime: formattedDate,
            endTime: formattedDate,
          },
        },
        integrationId: integrationId,
        retryCount: 3,
        isConvertToJson: false,
        isAddExtention: false,
      },
      user,
    )) as any;

    if (!queueData.ok) {
      throw new Error(`HTTP error! Status: ${queueData.status}`);
    }

    const xmlData = await queueData.text();
    try {
      const parsedData = JSON.parse(xmlData);

      if (parsedData.status === -6) {
        console.log('Status -6 detected. Clearing redis callCookie.');
        await redis.del('callCookie');
        return [];
      }
    } catch (error) {
      console.error(error.message);
    }

    try {
      const parser = new XMLParser();
      const jsonObject = parser.parse(xmlData);

      const rootStatistics = jsonObject.root_statistics || {};
      const queues = rootStatistics.queue || [];
      if (integration.queues) {
        const matchedQueues = queues.filter((queue) =>
          integration.queues.includes(queue.queue.toString()),
        );

        return matchedQueues;
      }
      return [];
    } catch (error) {
      console.error('Error parsing response as XML:', error.message);
      return [];
    }
  },

  async callWaitingList(_root, { queue }) {
    const redisKey = `callRealtimeHistory:${queue}:waiting`;
    return await redis.get(redisKey);
  },

  async callProceedingList(_root, { queue }) {
    const redisKey = `callRealtimeHistory:${queue}:talking`;
    return await redis.get(redisKey);
  },

  async callQueueMemberList(
    _root,
    { integrationId, queue },
    { models, user }: IContext,
  ) {
    const queueData = (await sendToGrandStream(
      models,
      {
        path: 'api',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: {
          request: {
            action: 'getCallQueuesMemberMessage',
            extension: queue,
          },
        },
        integrationId: integrationId,
        retryCount: 3,
        isConvertToJson: true,
        isAddExtention: false,
      },
      user,
    )) as any;

    if (queueData && queueData.response) {
      const { CallQueueMembersMessage } = queueData.response;

      if (CallQueueMembersMessage) {
        return CallQueueMembersMessage;
      }
      return [];
    }
    return 'request failed';
  },

  async callTodayStatistics(
    _root,
    { queue }: { queue: string },
    { models }: IContext,
  ) {
    const DEFAULT_VALUE = '0';

    try {
      const now = new Date();
      const dateFrom = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      const dateTo = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );

      const todayCdrs = await models.CallCdrs.find({
        actionType: { $regex: queue },
        start: {
          $gte: dateFrom,
          $lt: dateTo,
        },
      });

      const [
        serviceLevel,
        firstCallResolution,
        averageSpeed,
        averageAnsweredTime,
      ] = await Promise.all([
        calculateServiceLevel(todayCdrs),
        calculateFirstCallResolution(todayCdrs),
        calculateAverageSpeedOfAnswer(todayCdrs),
        calculateAverageHandlingTime(todayCdrs),
      ]);

      return {
        serviceLevel: serviceLevel?.toString() || DEFAULT_VALUE,
        firstCallResolution: firstCallResolution?.toString() || DEFAULT_VALUE,
        averageSpeed: averageSpeed?.toString() || DEFAULT_VALUE,
        averageAnsweredTime: averageAnsweredTime?.toString() || DEFAULT_VALUE,
      };
    } catch (error) {
      console.error('Error in callTodayStatistics:', error);

      return {
        serviceLevel: DEFAULT_VALUE,
        firstCallResolution: DEFAULT_VALUE,
        averageSpeed: DEFAULT_VALUE,
        averageAnsweredTime: DEFAULT_VALUE,
      };
    }
  },

  async callCalculateServiceLevel(_root, { queue }, { models }: IContext) {
    const now = new Date();
    const dateFrom = new Date(now.getFullYear(), 5, 12);
    const dateTo = new Date(now.getFullYear(), 5, 13);

    const todyCdrs = await models.CallCdrs.find({
      actionType: { $regex: queue },
      start: {
        $gte: dateFrom,
        $lt: dateTo,
      },
    });

    const serviceLevel = await calculateServiceLevel(todyCdrs);

    return serviceLevel;
  },
  async callCalculateFirstCallResolution(
    _root,
    { queue },
    { models }: IContext,
  ) {
    const now = new Date();
    const dateFrom = new Date(now.getFullYear(), 5, 12);
    const dateTo = new Date(now.getFullYear(), 5, 13);

    const todyCdrs = await models.CallCdrs.find({
      actionType: { $regex: queue },
      start: {
        $gte: dateFrom,
        $lt: dateTo,
      },
    });

    const firstCallResolution = await calculateFirstCallResolution(todyCdrs);

    return firstCallResolution;
  },
  async callCalculateAbandonmentRate(_root, { queue }, { models }: IContext) {
    const now = new Date();
    const dateFrom = new Date(now.getFullYear(), 5, 12);
    const dateTo = new Date(now.getFullYear(), 5, 13);

    const todyCdrs = await models.CallCdrs.find({
      actionType: { $regex: queue },
      start: {
        $gte: dateFrom,
        $lt: dateTo,
      },
    });

    const abandonedRate = await calculateAbandonmentRate(todyCdrs);

    return abandonedRate;
  },

  async callCalculateAverageSpeedOfAnswer(
    _root,
    { queue },
    { models }: IContext,
  ) {
    const now = new Date();
    const dateFrom = new Date(now.getFullYear(), 5, 12);
    const dateTo = new Date(now.getFullYear(), 5, 13);

    const todyCdrs = await models.CallCdrs.find({
      actionType: { $regex: queue },
      start: {
        $gte: dateFrom,
        $lt: dateTo,
      },
    });

    const averageSpeed = await calculateAverageSpeedOfAnswer(todyCdrs);

    return averageSpeed;
  },

  async callCalculateAverageHandlingTime(
    _root,
    { queue },
    { models }: IContext,
  ) {
    const now = new Date();
    const dateFrom = new Date(now.getFullYear(), 5, 12);
    const dateTo = new Date(now.getFullYear(), 5, 13);

    const todyCdrs = await models.CallCdrs.find({
      actionType: { $regex: queue },
      start: {
        $gte: dateFrom,
        $lt: dateTo,
      },
    });

    const averageAnsweredTime = await calculateAverageHandlingTime(todyCdrs);

    return averageAnsweredTime;
  },

  getQueueStatus: async (parent, { extension }, { models }) => {
    try {
      const integration = await models.CallIntegrations.findOne({
        queues: extension,
      }).lean();

      if (!integration) {
        throw new Error(`Queue ${extension} not found`);
      }

      // Return cached or default data
      return {
        extension,
        queuename: integration.name,
        totalCalls: 0,
        waitingCalls: 0,
        completedCalls: 0,
        abandonedCalls: 0,
        agents: [],
        statistics: null,
      };
    } catch (error) {
      console.error('Error fetching queue status:', error);
      throw error;
    }
  },

  getActiveCalls: async (parent, { extension }, { models }) => {
    // Implement logic to fetch active calls from cache/database
    return [];
  },

  getAgentStats: async (parent, { extension, agentExtension }, { models }) => {
    // Implement logic to fetch agent statistics
    return [];
  },
};
export default callQueries;
