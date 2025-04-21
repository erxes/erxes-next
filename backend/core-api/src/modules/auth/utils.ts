import { IUserDocument } from 'erxes-api-shared/core-types';
import { redis } from 'erxes-api-shared/utils';

export const saveValidatedToken = (token: string, user: IUserDocument) => {
  return redis.set(`user_token_${user._id}_${token}`, 1, 'EX', 24 * 60 * 60);
};
