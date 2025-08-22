import { gql } from '@apollo/client';

export const TASKS_CHANGED = gql`
  subscription operationTasksChanged($filter: ITaskFilter) {
    operationTasksChanged(filter: $filter) {
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
    }
  }
`;
