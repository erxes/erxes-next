import { gql } from '@apollo/client';

export const CREATE_TASK_MUTATION = gql`
  mutation CreateTask(
    $name: String!
    $teamId: String!
    $description: String
    $status: String
    $priority: Int
    $startDate: Date
    $targetDate: Date
    $assigneeId: String
    $projectId: String
  ) {
    createTask(
      name: $name
      teamId: $teamId
      description: $description
      status: $status
      priority: $priority
      startDate: $startDate
      targetDate: $targetDate
      assigneeId: $assigneeId
      projectId: $projectId
    ) {
      _id
    }
  }
`;
