import { savingMutations } from '@/saving/graphql/resolvers/mutations/saving';
import blockMutations from '~/modules/saving/graphql/resolvers/mutations/block';
import contractMutations from '~/modules/saving/graphql/resolvers/mutations/contract';
import contractTypeMutations from '~/modules/saving/graphql/resolvers/mutations/contractTypes';
import periodLockMutations from '~/modules/saving/graphql/resolvers/mutations/periodLock';
import transactionMutations from '~/modules/saving/graphql/resolvers/mutations/transaction';

export const mutations = {
  ...savingMutations,
  ...contractTypeMutations,
  ...transactionMutations,
  ...contractMutations,
  ...blockMutations,
  ...periodLockMutations,
};
