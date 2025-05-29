import { gql } from '@apollo/client';

export const REMOVE_COMPANIES = gql`
  mutation Mutation($companyIds: [String]) {
    companiesRemove(companyIds: $companyIds)
  }
`;
