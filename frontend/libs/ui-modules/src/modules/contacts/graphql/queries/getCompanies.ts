import { gql } from '@apollo/client';
import {
  GQL_CURSOR_PARAM_DEFS,
  GQL_PAGE_INFO,
  GQL_CURSOR_PARAMS,
} from 'erxes-ui';
export const GET_COMPANIES = gql`
  query companiesSelect($searchValue: String, ${GQL_CURSOR_PARAM_DEFS}) {
    companies(searchValue: $searchValue, ${GQL_CURSOR_PARAMS}) {
      list {
        _id
        avatar
        primaryName
        names
        primaryEmail
      }
      totalCount
      ${GQL_PAGE_INFO}
    }
  }
`;

export const GET_ASSIGNED_COMPANIES = gql`
  query assignedCompaniesSelect($searchValue: String) {
    assignedCompanies(searchValue: $searchValue) {
      _id
      avatar
      primaryName
    }
  }
`;
