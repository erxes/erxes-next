import { gql } from '@apollo/client';

export const GET_ACTIVE_CYCLES = gql`
  query GetActiveCycles(
    $teamId: String
    $orderBy: JSON
    $sortMode: String
    $aggregationPipeline: [JSON]
  ) {
    getCyclesActive(
      teamId: $teamId
      orderBy: $orderBy
      sortMode: $sortMode
      aggregationPipeline: $aggregationPipeline
    ) {
      list {
        _id
        name
        description
        startDate
        endDate
        teamId
        isCompleted
        isActive
        statistics
        donePercent
        unFinishedTasks
      }
      totalCount
    }
  }
`;
