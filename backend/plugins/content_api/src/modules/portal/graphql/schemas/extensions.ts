import { getPlugin, isEnabled } from 'erxes-api-shared/utils';

export const TypeExtensions = `
  extend type Customer @key(fields: "_id") {
    _id: String! @external
  }

  extend type Company @key(fields: "_id") {
    _id: String! @external
  }
`;
