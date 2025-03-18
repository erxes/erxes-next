import { getService } from 'erxes-api-utils';

export const getContentTypes = async (serviceName) => {
  const service = await getService(serviceName);
  const meta = service.config.meta || {};
  const types = meta?.tags?.types || [];
  return types.map((type) => `${serviceName}:${type.type}`);
};
