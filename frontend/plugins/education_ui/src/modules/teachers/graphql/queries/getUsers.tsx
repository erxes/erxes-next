import { gql } from '@apollo/client';
import {
  GQL_CURSOR_PARAM_DEFS,
  GQL_CURSOR_PARAMS,
  GQL_PAGE_INFO,
} from 'erxes-ui/constants';

export const GET_USERS = gql`
  query Users(
    $searchValue: String
    $ids: [String]
    $excludeIds: Boolean
    ${GQL_CURSOR_PARAM_DEFS}
  ) {
    users(
      searchValue: $searchValue
      ids: $ids
      excludeIds: $excludeIds
      ${GQL_CURSOR_PARAMS}
    ) {
      list {
        _id
        details {
          avatar
          fullName
        }
      }
      ${GQL_PAGE_INFO}
    }
  }
`;
