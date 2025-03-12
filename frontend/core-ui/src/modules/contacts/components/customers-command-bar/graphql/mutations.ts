import { gql } from '@apollo/client';

export const CUSTOMERS_MERGE_MUTATION = gql`
  mutation Mutation($customerIds: [String], $customerFields: JSON) {
    customersMerge(customerIds: $customerIds, customerFields: $customerFields) {
      _id
    }
  }
`;
