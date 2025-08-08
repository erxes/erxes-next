import gql from 'graphql-tag';
import {
  GQL_CURSOR_PARAM_DEFS,
  GQL_CURSOR_PARAMS,
  GQL_PAGE_INFO,
} from 'erxes-ui';

export const GET_TASKS = gql`
  query GetTasks(
    $assigneeId: String
    $createdBy: String
    $status: String
    $priority: Int
    $startDate: Date
    $targetDate: Date
    $projectId: String 
    $teamId: String
    $estimatedPoint: Int
    $orderBy: JSON
    ${GQL_CURSOR_PARAM_DEFS}
  ) {
    getTasks(
      assigneeId: $assigneeId
      createdBy: $createdBy
      status: $status
      priority: $priority
      startDate: $startDate
      targetDate: $targetDate
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
        teamId
        assigneeId
        startDate
        targetDate
        createdAt
        updatedAt
        createdBy 
        cycleId
        projectId
        estimatedPoint
        estimateChoices
      } 
      ${GQL_PAGE_INFO}
      totalCount
    }
  }
`;
