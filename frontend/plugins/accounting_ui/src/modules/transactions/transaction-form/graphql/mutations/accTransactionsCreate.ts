import { gql } from '@apollo/client';

export const ACC_TRANSACTIONS_CREATE = gql`
  mutation accTransactionsCreate($trDocs: [TransactionInput]) {
    accTransactionsCreate(trDocs: $trDocs) {
      _id
    }
  }
`;
