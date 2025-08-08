import { gql } from '@apollo/client';

export const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask(
    $_id: String!
    $name: String
    $description: String
    $teamId: String
    $status: String
    $priority: Int
    $labelIds: [String]
    $tagIds: [String]
    $assigneeId: String
    $startDate: Date
    $targetDate: Date
    $cycleId: String
    $projectId: String
    $estimatedPoint: Int
  ) {
    updateTask(
      _id: $_id
      name: $name
      description: $description
      teamId: $teamId
      status: $status
      priority: $priority
      labelIds: $labelIds
      tagIds: $tagIds
      assigneeId: $assigneeId
      startDate: $startDate
      targetDate: $targetDate
      cycleId: $cycleId
      projectId: $projectId
      estimatedPoint: $estimatedPoint
    ) {
      _id
    }
  }
`;
