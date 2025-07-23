import * as bodyParser from 'body-parser';
import crypto from 'crypto';

import { getSubdomain, graphqlPubsub } from 'erxes-api-shared/utils';
import { generateModels } from '~/connectionResolvers';
import { debugError } from '~/modules/inbox/utils';
import { receiveCdr } from '~/modules/integrations/call/services/cdrServices';

import express from 'express';

const generateApiKeyHash = (plainKey) => {
  return crypto.createHash('sha256').update(plainKey).digest('hex');
};
// Authentication middleware
const authenticateAPI = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({
        error: 'Authentication required',
        requestId: req.id,
      });
    }

    // API Key authentication
    if (apiKey) {
      const hashedApiKey = crypto
        .createHash('sha256')
        .update(apiKey)
        .digest('hex');

      const validApiKeys = 'asd';
      const validApiKeyHashes = generateApiKeyHash(validApiKeys);

      if (validApiKeyHashes !== hashedApiKey) {
        debugError({
          requestId: req.id,
          event: 'invalid_api_key',
          ip: req.ip,
          apiKey: apiKey.substring(0, 8) + '...',
        });
        return res.status(401).json({
          error: 'Invalid API key',
          requestId: req.id,
        });
      }
    }

    next();
  } catch (error) {
    debugError({
      requestId: req.id,
      event: 'auth_error',
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      error: 'Authentication error',
      requestId: req.id,
    });
  }
};

const initCallApp = async (app) => {
  app.use(
    express.json({
      limit: '15mb',
    }),
  );

  app.use((_req, _res, next) => {
    next();
  });

  // init bots
  app.post('/call/receiveWaitingCall', authenticateAPI, async (req, res) => {
    try {
      const data = req.body;
      const history = data.history;

      graphqlPubsub.publish(`waitingCallReceived`, {
        waitingCallReceived: history,
      });
      res.status(200).json({ message: 'Call received successfully' });
    } catch (error) {
      console.error('Error receiving waiting call:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/call/receiveTalkingCall', authenticateAPI, async (req, res) => {
    try {
      const data = req.body;
      const history = data.history;
      graphqlPubsub.publish(`talkingCallReceived`, {
        talkingCallReceived: history,
      });
      res.status(200).json({ message: 'Call received successfully' });
    } catch (error) {
      console.error('Error receiving talking call:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/call/receiveAgents', authenticateAPI, async (req, res) => {
    try {
      const data = req.body;
      const history = data.history;

      graphqlPubsub.publish(`agentCallReceived`, {
        agentCallReceived: history,
      });
      res.status(200).json({ message: 'Call Agents received successfully' });
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
  app.post('/call/cdrReceive', authenticateAPI, async (req, res) => {
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
