import { gql } from '@apollo/client';

export const COUNTS = gql`
  query paymentsTotalCount($kind: String, $status: String) {
    paymentsTotalCount(kind: $kind, status: $status) {
      byKind
      total
      __typename
    }
  }
`;
