import contactResolvers from '../../modules/contacts/graphql/resolvers/customResolvers';
import productResolvers from '../../modules/products/graphql/resolvers/customResolvers';

export const customResolvers = {
  ...contactResolvers,
  ...productResolvers,
};
