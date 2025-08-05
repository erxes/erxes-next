import { savingQueries } from '@/saving/graphql/resolvers/queries/saving';
import blockQueries from '~/modules/saving/graphql/resolvers/queries/block';
import contractQueries from '~/modules/saving/graphql/resolvers/queries/contract';
import contractTypeQueries from '~/modules/saving/graphql/resolvers/queries/contractTypes';
import periodLockQueries from '~/modules/saving/graphql/resolvers/queries/periodLock';
import transactionQueries from '~/modules/saving/graphql/resolvers/queries/transaction';

export const queries = {
  ...savingQueries,
  ...contractTypeQueries,
  ...transactionQueries,
  ...contractQueries,
  ...blockQueries,
  ...periodLockQueries,
};
