import { getPlugin, isEnabled } from 'erxes-api-shared/utils';

export const TypeExtensions = `
  extend type User @key(fields: "_id") {
    _id: String! @external
    sampe: String
  }


  
`;
