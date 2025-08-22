import gql from 'graphql-tag';
import { GQL_PAGE_INFO } from 'erxes-ui';

export const GET_TASKS = gql`
  query GetTasks(
    $filter: ITaskFilter
  ) {
    getTasks(
      filter: $filter
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
        estimatePoint
        estimateChoices
      } 
      ${GQL_PAGE_INFO}
      totalCount
    }
  }
`;
