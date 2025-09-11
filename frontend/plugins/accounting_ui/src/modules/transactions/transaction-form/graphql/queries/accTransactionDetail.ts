import { gql } from '@apollo/client';
import { commonTransactionFields } from '@/transactions/graphql/transactionQueries';

export const TRANSACTION_DETAIL_QUERY = gql`
  query AccTransactionDetail($_id: ID!) {
    accTransactionDetail(_id: $_id) {
      ${commonTransactionFields}
    }
  }
`;
