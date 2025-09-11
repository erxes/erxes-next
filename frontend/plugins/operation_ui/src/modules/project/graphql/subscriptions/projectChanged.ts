import { gql } from '@apollo/client';

export const PROJECT_CHANGED = gql`
  subscription operationProjectChanged($_id: ID!) {
    operationProjectChanged(_id: $_id) {
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
