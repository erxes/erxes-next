import gql from 'graphql-tag';
import {
  GQL_CURSOR_PARAM_DEFS,
  GQL_CURSOR_PARAMS,
  GQL_PAGE_INFO,
} from 'erxes-ui';

export const GET_TASKS = gql`
  query GetTasks(
    status: String
    priority: Int
    assignee: String
    createdBy: String
    cycleId: String
    labelIds: [String]
    tagIds: [String]
    createdAt: Date
    updatedAt: Date
    projectId: String 
    teamId: String
    estimatedPoint: Int
    orderBy: JSON
    ${GQL_CURSOR_PARAM_DEFS}
  ) {
    getTasks(
      status: $status
      priority: $priority
      assignee: $assignee
      createdBy: $createdBy
      cycleId: $cycleId
      labelIds: $labelIds
      tagIds: $tagIds
      createdAt: $createdAt
      updatedAt: $updatedAt
      projectId: $projectId
      teamId: $teamId
      estimatedPoint: $estimatedPoint
      orderBy: $orderBy
      ${GQL_CURSOR_PARAMS}
    ) {
      list {
        _id
        name
        description
        status
        priority
        assignee
        createdBy
        cycleId
        labelIds
        tagIds
        createdAt
        updatedAt
        projectId
        teamId
        estimatedPoint
      } 
      ${GQL_PAGE_INFO}
      totalCount
    }
  }
`;
