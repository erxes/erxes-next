import gql from 'graphql-tag';

export const GET_PROJECT = gql`
  query getProject($_id: ID!) {
    getProject(_id: $_id) {
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
`;
