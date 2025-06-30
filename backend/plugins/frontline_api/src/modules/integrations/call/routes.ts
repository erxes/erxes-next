import express, { Router } from 'express';

import { getSubdomain, graphqlPubsub } from 'erxes-api-shared/utils';
import { generateModels } from '~/connectionResolvers';
import { receiveCdr } from '~/modules/integrations/call/services/cdrServices';
export const router: Router = express.Router();

router.post('/call/cdrReceive', async (req, res) => {
  try {
    const data = JSON.parse(JSON.stringify(req.body));
    const subdomain = getSubdomain(req);

    const models = await generateModels(subdomain);

    await receiveCdr(models, subdomain, data);

    res.status(200).json({ message: 'Call cdr received successfully' });
  } catch (error) {
    console.log('call cdr error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/call/receiveWaitingCall', async (req, res) => {
  try {
    const data = JSON.parse(JSON.stringify(req.body));
    const history = JSON.parse(JSON.stringify(data.history));

    graphqlPubsub.publish(`waitingCallReceived`, {
      waitingCallReceived: history,
    });
    res.status(200).json({ message: 'Call received successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/call/receiveTalkingCall', async (req, res) => {
  try {
    const data = JSON.parse(JSON.stringify(req.body));
    const history = JSON.parse(JSON.stringify(data.history));
    graphqlPubsub.publish(`talkingCallReceived`, {
      talkingCallReceived: history,
    });
    res.status(200).json({ message: 'Call received successfully' });
  } catch (error) {
    console.error('Error receive talking the call:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/call/receiveAgents', async (req, res) => {
  try {
    const data = JSON.parse(JSON.stringify(req.body));
    const history = JSON.parse(JSON.stringify(data.history));

    graphqlPubsub.publish(`agentCallReceived`, {
      agentCallReceived: JSON.parse(JSON.stringify(history)),
    });
    res.status(200).json({ message: 'Call Agents received successfully' });
  } catch (error) {
    console.error('Error receive agents the call:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
