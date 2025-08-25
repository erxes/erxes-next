import WebSocket from 'ws';
import crypto from 'crypto';
import { generateModels } from '~/connectionResolvers';
import { graphqlPubsub } from 'erxes-api-shared/utils';
// import your redis client helper — adjust to your project
import redis from './redlock';

const PBX_IP = 'call.erxes.io';
const API_USER = 'testApi';
const API_PASSWORD = 'testApi13';
const WS_URL = `wss://${PBX_IP}:8089/websockify`;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// --- Redis (use your project's instance) ---

// In-memory aggregate (fast access). Redis is authoritative across restarts.
type AgentInfo = {
  member_extension: string;
  status?: string;
  first_name?: string;
  last_name?: string;
  // add other fields as needed...
  [k: string]: any;
};
type QueueState = {
  extension: string;
  waiting: any[]; // caller objects
  talking: any[]; // active call objects
  agents: Record<string, AgentInfo>; // keyed by member_extension
  stats?: any; // aggregate stats object from CallQueueStatus
};

const queueStateMap: Record<string, QueueState> = {};

let wsClient: WebSocket | null = null;
let reconnectAttempts = 0;
let isSubscribing = false;

async function initWebsocketClient() {
  const models = await generateModels('os');

  // load queues from DB
  const integrations = await models.CallIntegrations.find({
    'queues.0': { $exists: true },
  }).lean();

  const queues = ([] as string[]).concat(
    ...integrations.map((i: any) => i.queues || []),
  );

  // Build initial empty queueStateMap entries
  for (const q of queues) {
    queueStateMap[q] = {
      extension: q.toString(),
      waiting: [],
      talking: [],
      agents: {},
      stats: {},
    };
  }

  connectAndListen(queues);
}

function connectAndListen(queues: string[]) {
  wsClient = new WebSocket(WS_URL);

  wsClient.on('open', () => {
    console.log('✅ WS connected');
    reconnectAttempts = 0;
    // request challenge
    wsClient!.send(
      JSON.stringify({
        type: 'request',
        message: {
          action: 'challenge',
          username: API_USER,
          version: '1.0',
          transactionid: 'tx_challenge_' + Date.now(),
        },
      }),
    );
  });

  wsClient.on('message', async (raw) => {
    let json: any;
    try {
      json = JSON.parse(raw.toString());
    } catch (err) {
      console.error('Invalid JSON from PBX:', err);
      return;
    }

    // --- challenge -> login ---
    if (json.type === 'response' && json.message?.action === 'challenge') {
      if (json.message.status === 0 && json.message.challenge) {
        const token = crypto
          .createHash('md5')
          .update(json.message.challenge + API_PASSWORD)
          .digest('hex');
        wsClient!.send(
          JSON.stringify({
            type: 'request',
            message: {
              transactionid: 'login_ws_' + Date.now(),
              action: 'login',
              username: API_USER,
              token,
            },
          }),
        );
      } else {
        console.error('Challenge failed', json.message);
      }
      return;
    }

    // --- login success -> subscribe to events ---
    if (json.type === 'response' && json.message?.action === 'login') {
      if (json.message.status === 0) {
        console.log('✅ WS login ok. Subscribing...');
        subscribeToQueues(queues);
      } else {
        console.error('WS login failed:', json.message);
      }
      return;
    }

    // --- subscribe response ---
    if (json.type === 'response' && json.message?.action === 'subscribe') {
      if (json.message.status === 0) {
        console.log('✅ Subscribed to PBX events');
      } else {
        console.error('Subscribe failed:', json.message);
      }
      return;
    }

    // --- actual pushed events from PBX ---
    // PBX might send many event names: CallQueueStatus, ActiveCallStatus, CallQueueMember, etc.
    try {
      await applyIncomingEvent(json);
    } catch (err) {
      console.error('Error processing event:', err);
    }
  });

  wsClient.on('close', (code, reason) => {
    console.warn('WS closed', code, reason.toString());
    wsClient = null;
    scheduleReconnect(queues);
  });

  wsClient.on('error', (err) => {
    console.error('WS error:', err.message);
  });
}

function subscribeToQueues(queues: string[]) {
  if (!wsClient || wsClient.readyState !== WebSocket.OPEN || isSubscribing)
    return;
  isSubscribing = true;

  // Example: subscribe to CallQueueStatus for multiple queues, ActiveCallStatus for active calls
  const eventnames = [
    'CallQueueStatus/6518',
    // `CallQueueStatus/${queues.join(',')}`, // if PBX supports comma-list
    'ActiveCallStatus',
    // optionally 'CallQueueMember' or other events as needed
  ];

  wsClient!.send(
    JSON.stringify({
      type: 'request',
      message: {
        transactionid: 'subscribe_' + Date.now(),
        action: 'subscribe',
        eventnames,
      },
    }),
  );

  isSubscribing = false;
}

function scheduleReconnect(queues: string[]) {
  reconnectAttempts++;
  const delay = Math.min(30000, 1000 * 2 ** reconnectAttempts); // exponential backoff up to 30s
  console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts})`);
  setTimeout(() => connectAndListen(queues), delay);
}

// --- Apply incoming messages to aggregate ---
async function applyIncomingEvent(json: any) {
  // Some messages might wrap the real payload in `message` or be arrays
  // Normalize: many logs show e.g. { type: 'event', message: { eventname: 'CallQueueStatus', ... } }
  const payload = json.message || json;
  console.log(payload, 'payload');
  // If it's an array of events
  if (Array.isArray(payload)) {
    for (const p of payload) {
      await handleOneEvent(p);
    }
    return;
  }

  // If top-level has eventname
  if (
    payload.eventname ||
    payload.callQueueStatus ||
    payload.ActiveCallStatus
  ) {
    await handleOneEvent(payload);
    return;
  }

  // If unknown wrap, try generic handler
  await handleOneEvent(payload);
}

async function handleOneEvent(evt: any) {
  // Examples you printed:
  // - CallQueueStatus EVENT: [ { extension: '6518', ... } ]
  // - ActiveCallStatus EVENT: [ { chantype: 'unbridge', action: 'delete', channel: 'PJSIP/1802-000024e5' } ]
  // - Agent event (member updates) with queue_action: 'CallQueueUpdateMember' / 'CallQueueAnswered' etc.

  // Normalize different shapes — sometimes pbx sends arrays
  console.log('1');
  if (Array.isArray(evt)) {
    for (const e of evt) await handleOneEvent(e);
    return;
  }
  console.log('2');

  // If object has extension -> treat as queue-level info
  const qExt = evt.extension ? evt.extension.toString() : null;
  if (!qExt) {
    // maybe active call event — inspect fields
    if (evt.action && evt.eventbody?.[0]?.channel) {
      console.log('3');
      // Active call: update talking/waiting sets if you can parse caller/callee from channel
      // For now just publish raw active call events
      publishRawActiveEvent(evt);
    }
    console.log('4', evt.action, evt.eventbody?.[0]?.channel);

    return;
  }

  // Ensure queueState exists
  if (!queueStateMap[qExt]) {
    queueStateMap[qExt] = {
      extension: qExt,
      waiting: [],
      talking: [],
      agents: {},
      stats: {},
    };
  }

  // Distinguish event types by checking keys
  if (
    evt.callswaiting !== undefined ||
    evt.callswaiting === 0 ||
    evt.callstotal !== undefined ||
    evt.callscomplete !== undefined
  ) {
    console.log('5');

    // This looks like queue statistics (CallQueueStatus full stats)
    queueStateMap[qExt].stats = { ...evt };
    // Some systems may include callswaiting or callstotal etc.
    await persistAndPublishIfChanged(qExt);
    return;
  }

  if (evt.member && Array.isArray(evt.member)) {
    console.log('6');

    // Member / agent update — could be a short object with queue_action indicating event
    for (const m of evt.member) {
      const ext = m.member_extension || m.calleeid || m.member;
      if (!ext) continue;
      // Merge agent info
      queueStateMap[qExt].agents[ext] = {
        ...(queueStateMap[qExt].agents[ext] || {}),
        ...m,
      };
      // If this member object represents a queue_action like CallQueueAnswered, you may want to update talking/waiting arrays:
      if (m.queue_action === 'CallQueueAnswered' && m.callerid) {
        // move from waiting -> talking
        // Ensure no duplicates, simple approach: remove waiting entries matching callerid, add to talking
        queueStateMap[qExt].waiting = (
          queueStateMap[qExt].waiting || []
        ).filter((c: any) => c.callerid !== m.callerid);
        queueStateMap[qExt].talking = [
          ...(queueStateMap[qExt].talking || []),
          {
            callerid: m.callerid,
            calleeid: ext,
            bridged: true,
            bridge_time: m.bridge_time || new Date().toISOString(),
          },
        ];
      }
    }
    console.log('7');

    await persistAndPublishIfChanged(qExt);
    return;
  }

  // If it's something like calls waiting list or call details (your logs showed "CALL UPDATE: 1802 → 94329256 (Up)")
  if (evt.action && (evt.callernum || evt.callerid)) {
    // action: add/update/delete — treat as active call change
    await handleActiveCallEventForQueue(qExt, evt);
    return;
  }

  // Default: save as stats
  queueStateMap[qExt].stats = { ...(queueStateMap[qExt].stats || {}), ...evt };
  await persistAndPublishIfChanged(qExt);
}

async function handleActiveCallEventForQueue(queueExt: string, evt: any) {
  // Basic: on add -> push to waiting; on update -> maybe move to talking; on delete -> remove from talking
  const callerId = evt.callernum || evt.callerid;
  const action = (evt.action || '').toLowerCase();

  if (!callerId) return;

  if (action === 'add') {
    // append to waiting if not exists
    const exists = (queueStateMap[queueExt].waiting || []).some(
      (c: any) => c.callerid === callerId,
    );
    if (!exists) {
      queueStateMap[queueExt].waiting.push({
        callerid: callerId,
        channel: evt.channel || null,
        state: evt.state || null,
      });
    }
  } else if (action === 'update') {
    // if update contains bridge info -> move to talking
    const inWaiting = (queueStateMap[queueExt].waiting || []).some(
      (c: any) => c.callerid === callerId,
    );
    if (evt.state && evt.state.toLowerCase().includes('up') && inWaiting) {
      // move waiting->talking
      queueStateMap[queueExt].waiting = queueStateMap[queueExt].waiting.filter(
        (c: any) => c.callerid !== callerId,
      );
      queueStateMap[queueExt].talking.push({
        callerid: callerId,
        channel: evt.channel || null,
      });
    } else {
      // maybe update waiting item metadata
      queueStateMap[queueExt].waiting = (
        queueStateMap[queueExt].waiting || []
      ).map((c: any) => {
        if (c.callerid === callerId) return { ...c, ...evt };
        return c;
      });
    }
  } else if (action === 'delete') {
    // remove from both waiting and talking
    queueStateMap[queueExt].waiting = (
      queueStateMap[queueExt].waiting || []
    ).filter((c: any) => c.callerid !== callerId && c.channel !== evt.channel);
    queueStateMap[queueExt].talking = (
      queueStateMap[queueExt].talking || []
    ).filter((t: any) => t.callerid !== callerId && t.channel !== evt.channel);
  }

  await persistAndPublishIfChanged(queueExt);
}

async function publishRawActiveEvent(evt: any) {
  // Useful to keep older behaviour where frontend expects ActiveCallStatus events
  console.log('ActiveCallStatus:', evt);
  graphqlPubsub.publish('ActiveCallStatus', { activeCallEvent: evt });
}

// --- persist & publish if changed (compare with redis snapshot) ---
async function persistAndPublishIfChanged(queueExt: string) {
  const key = `callRealtimeHistory:${queueExt}:aggregate`;
  const newSnapshot = JSON.stringify(queueStateMap[queueExt]);

  const old = await redis.get(key);
  console.log('old:', old);
  if (old !== newSnapshot) {
    // Persist new snapshot
    await redis.set(key, newSnapshot);
    // Publish aggregated event
    console.log(newSnapshot, 'newSnapshot');
    graphqlPubsub.publish('queueRealtimeUpdate', {
      queueRealtimeUpdate: JSON.parse(newSnapshot),
    });
    // Optionally keep backward compatibility and publish per-topic events:
    // graphqlPubsub.publish('waitingCallReceived', { waitingCallReceived: queueStateMap[queueExt].waiting });
    // graphqlPubsub.publish('talkingCallReceived', { talkingCallReceived: queueStateMap[queueExt].talking });
    // graphqlPubsub.publish('agentCallReceived', { agentCallReceived: Object.values(queueStateMap[queueExt].agents) });
    console.log(`🔔 Published queueRealtimeUpdate for ${queueExt}`);
  } else {
    // no change
  }
}

// Heartbeat
function startHeartbeat() {
  setInterval(() => {
    if (wsClient && wsClient.readyState === WebSocket.OPEN) {
      wsClient.send(
        JSON.stringify({
          type: 'request',
          message: { transactionid: 'hb_' + Date.now(), action: 'heartbeat' },
        }),
      );
    }
  }, 30000);
}

// Export init
export async function initWebsocketService() {
  await initWebsocketClient();
  startHeartbeat();
  // graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Shutting down WS client...');
    if (wsClient) wsClient.close();
    await redis.quit();
    process.exit(0);
  });
}
