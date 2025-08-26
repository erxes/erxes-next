import { gql } from '@apollo/client';

export const TASK_CHANGED = gql`
  subscription operationTaskChanged($filter: ITaskFilter) {
    operationTaskChanged(filter: $filter) {
      type
      task {
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
  }
`;
