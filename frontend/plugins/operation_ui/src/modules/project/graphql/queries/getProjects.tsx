import gql from 'graphql-tag';
import {
  GQL_CURSOR_PARAM_DEFS,
  GQL_CURSOR_PARAMS,
  GQL_PAGE_INFO,
} from 'erxes-ui';

export const GET_PROJECTS = gql`
  query getProjects($name: String, ${GQL_CURSOR_PARAM_DEFS}) {
    getProjects(name: $name, ${GQL_CURSOR_PARAMS}) {
      list {
        _id
        name
        description
        status
        priority
        teamIds
        leadId
        startDate
        targetDate
        createdAt
        updatedAt
      }
      ${GQL_PAGE_INFO}
    }
  }
`;
