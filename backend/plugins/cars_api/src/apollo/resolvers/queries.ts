import { carQueries } from '~/modules/module/graphql/resolvers/queries/carQueries';
import { CarCategoryQueries } from '~/modules/module/graphql/resolvers/queries/categoryQueries';

export const queries = {
  ...carQueries,
  ...CarCategoryQueries,
};
