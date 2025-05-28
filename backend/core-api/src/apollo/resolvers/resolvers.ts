import contactResolvers from '../../modules/contacts/graphql/resolvers/customResolvers';
import productResolvers from '../../modules/products/graphql/resolvers/customResolvers';
import segmentResolvers from '../../modules/segments/graphql/resolvers/customResolvers';
import structureResolvers from '~/modules/organization/structure/graphql/resolvers/customResolvers';
import logResolvers from '../../modules/logs/graphql/resolvers/customResolvers';

export const customResolvers = {
  ...contactResolvers,
  ...productResolvers,
  ...segmentResolvers,
  ...structureResolvers,
  ...logResolvers,
};
