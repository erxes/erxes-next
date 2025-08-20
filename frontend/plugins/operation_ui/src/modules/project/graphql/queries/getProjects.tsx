import gql from 'graphql-tag';
import {
  GQL_CURSOR_PARAM_DEFS,
  GQL_CURSOR_PARAMS,
  GQL_PAGE_INFO,
} from 'erxes-ui';

export const GET_PROJECTS = gql`
  query GetProjects(
    $userId: String
    $name: String
    $status: Int
    $priority: Int
    $teamIds: [String]
    $leadId: String
    $startDate: Date
    $targetDate: Date
    $orderBy: JSON
    ${GQL_CURSOR_PARAM_DEFS}
  ) {
    getProjects(
      userId: $userId
      name: $name
      status: $status
      priority: $priority
      teamIds: $teamIds
      leadId: $leadId
      startDate: $startDate
      targetDate: $targetDate
      orderBy: $orderBy
      ${GQL_CURSOR_PARAMS}
    ) {
      list {
        _id
        name
        icon
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
