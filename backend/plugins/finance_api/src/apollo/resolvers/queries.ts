import { savingQueries } from '@/saving/graphql/resolvers/queries/saving';
import contractTypeQueries from '~/modules/saving/graphql/resolvers/queries/contractTypes';

export const queries = {
  ...savingQueries,
  ...contractTypeQueries,
};
