import { gql } from '@apollo/client';
import {
  GQL_CURSOR_PARAM_DEFS,
  GQL_CURSOR_PARAMS,
  GQL_PAGE_INFO,
} from 'erxes-ui';

export const BRANDS_QUERY = gql`
  query Brands($searchValue: String, ${GQL_CURSOR_PARAM_DEFS}) {
    brands(searchValue: $searchValue, ${GQL_CURSOR_PARAMS}) {
      list {
        _id
        name
        code
      }
      ${GQL_PAGE_INFO}
    }
  }
`;
