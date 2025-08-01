import { savingQueries } from '@/saving/graphql/resolvers/queries/saving';
import contractQueries from '~/modules/saving/graphql/resolvers/queries/contract';
import contractTypeQueries from '~/modules/saving/graphql/resolvers/queries/contractTypes';
import transactionQueries from '~/modules/saving/graphql/resolvers/queries/transaction';

export const queries = {
  ...savingQueries,
  ...contractTypeQueries,
  ...transactionQueries,
  ...contractQueries,
};
