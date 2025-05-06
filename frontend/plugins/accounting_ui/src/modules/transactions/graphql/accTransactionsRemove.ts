import { gql } from '@apollo/client';

export const ACC_TRANSACTIONS_REMOVE = gql`
  mutation accTransactionsRemove($parentId: String, $ptrId: String) {
    accTransactionsRemove(parentId: $parentId, ptrId: $ptrId)
  }
`;
