import { gql } from '@apollo/client';

export const PROJECT_CHANGED = gql`
  subscription operationProjectChanged($filter: IProjectFilter) {
    operationProjectChanged(filter: $filter) {
      type
      project {
        _id
        name
        icon
        description
        status
        priority
        teamIds
        leadId
        startDate
        targetDate
        createdAt
        updatedAt
      }
    }
  }
`;
