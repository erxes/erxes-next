import { sendTRPCMessage } from 'erxes-api-shared/utils';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const isInSegment = async (segmentId: string, targetId: string) => {
  await delay(15000);

  const response = await sendTRPCMessage({
    pluginName: 'core',
    method: 'query',
    module: 'segment',
    action: 'isInSegment',
    input: { segmentId, idToCheck: targetId },
    defaultValue: [],
  });

  return response;
};
