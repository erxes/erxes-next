import { gql } from '@apollo/client';

export const ACC_TRANSACTIONS_UPDATE = gql`
  mutation accTransactionsUpdate($parentId: String, $trDocs: [TransactionInput]) {
    accTransactionsUpdate(parentId: $parentId, trDocs: $trDocs) {
      _id
    }
  }
`;
