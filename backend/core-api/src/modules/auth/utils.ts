import { IUserDocument } from 'erxes-api-modules';
import { redis } from 'erxes-api-utils';

export const saveValidatedToken = (token: string, user: IUserDocument) => {
  return redis.set(`user_token_${user._id}_${token}`, 1, 'EX', 24 * 60 * 60);
};
