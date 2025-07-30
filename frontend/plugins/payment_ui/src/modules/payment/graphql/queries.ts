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


export const PAYMENTS = gql`
query payments($status: String, $kind: String) {
  payments(status: $status, kind: $kind) {
    _id
    name
    kind
    status
    config
    createdAt
  }
}
`;