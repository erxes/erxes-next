import gql from 'graphql-tag';

export const GET_TEAMS = gql`
  query getTeams($name: String) {
    getTeams(name: $name) {
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
