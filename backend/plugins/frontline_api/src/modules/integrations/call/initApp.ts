import * as bodyParser from 'body-parser';
import crypto from 'crypto';

import { getEnv, getSubdomain, graphqlPubsub } from 'erxes-api-shared/utils';
import { generateModels } from '~/connectionResolvers';
import { debugError } from '~/modules/inbox/utils';
import { receiveCdr } from '~/modules/integrations/call/services/cdrServices';

import express from 'express';

const authenticateApi = async (req, res, next) => {
  const erxesApiId = req.headers['x-integration-id'];

  if (!erxesApiId) {
    return res.status(401).json({ error: 'Integration ID required' });
  }
  const data = req.body;

  const subdomain = getSubdomain(req);

  const isAuthorized = await validateCompanyAccess(subdomain, erxesApiId, data);
  if (!isAuthorized) {
    console.warn(
      `Unauthorized CDR access attempt: ${subdomain}, integration: ${erxesApiId}`,
    );
    return res.status(403).json({ error: 'Unauthorized access to CDR data' });
  }
  next();
};

async function validateCompanyAccess(subdomain, erxesApiId, cdrData) {
  try {
    const models = await generateModels(subdomain);

    const integration = await models.CallIntegrations.findOne({
      inboxId: erxesApiId,
    });

    if (!integration) {
      return false;
    }

    // Verify trunk permissions
    const { src_trunk_name, dst_trunk_name } = cdrData;

    const hasTrunkAccess =
      integration.srcTrunk === src_trunk_name ||
      integration.dstTrunk === dst_trunk_name;

    return hasTrunkAccess;
  } catch (error) {
    console.error('Error validating company access:', error);
    return false;
  }
}

const initCallApp = async (app) => {
  app.use(
    express.json({
      limit: '15mb',
    }),
  );

  app.use((_req, _res, next) => {
    next();
  });

  app.post('/call/queueRealtimeUpdate', authenticateApi, async (req, res) => {
    try {
      const VERSION = getEnv({ name: 'VERSION' });
      if (!VERSION || (VERSION && VERSION === 'saas')) {
        const data = req.body;
        const history = data.history;

        graphqlPubsub.publish(`queueRealtimeUpdate`, {
          queueRealtimeUpdate: history,
        });
        res
          .status(200)
          .json({ message: 'Call dashboard data received successfully' });
      }
    } catch (error) {
      console.error('Error receiving agent call:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  // Error handling middleware
  app.use((error, _req, res, _next) => {
    console.error('Error in middleware:', error);
    res.status(500).send(error.message);
  });
  // init bots
  app.post('/call/cdrReceive', authenticateApi, async (req, res) => {
    try {
      const data = req.body;
      const subdomain = getSubdomain(req);

      const models = await generateModels(subdomain);

      await receiveCdr(models, subdomain, data);

      return res
        .status(200)
        .json({ message: 'Call cdr received successfully' });
    } catch (error) {
      console.error('Error receiving cdr:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};

export default initCallApp;
