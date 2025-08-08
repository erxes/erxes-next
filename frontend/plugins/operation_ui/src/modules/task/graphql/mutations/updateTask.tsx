import { gql } from '@apollo/client';

export const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask(
    $_id: String!
    $name: String
    $description: String
    $status: Int
    $priority: Int
    $teamId: String
    $startDate: Date
    $targetDate: Date
    $projectId: String
    $assigneeId: String
  ) {
    updateTask(
      _id: $_id
      name: $name
      description: $description
      status: $status
      priority: $priority
      teamIds: $teamIds
      startDate: $startDate
      targetDate: $targetDate
      projectId: $projectId
      assigneeId: $assigneeId
    ) {
      _id
    }
  }
`;
