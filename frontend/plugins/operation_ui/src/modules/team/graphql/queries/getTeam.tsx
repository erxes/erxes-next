import gql from 'graphql-tag';

export const GET_TEAM = gql`
  query getTeam($_id: String!) {
    getTeam(_id: $_id) {
      _id
      name
      icon
      description
      memberIds

      taskCount
      createdAt
    }
  }
`;
