import contactResolvers from '@/contacts/graphql/resolvers/customResolvers';
import productResolvers from '@/products/graphql/resolvers/customResolvers';
import segmentResolvers from '@/segments/graphql/resolvers/customResolvers';
import structureResolvers from '@/organization/structure/graphql/resolvers/customResolvers';
// import logResolvers from '../../modules/logs/graphql/resolvers/customResolvers';

export const customResolvers = {
  ...contactResolvers,
  ...productResolvers,
  ...segmentResolvers,
  ...structureResolvers,
  // ...logResolvers,
};
