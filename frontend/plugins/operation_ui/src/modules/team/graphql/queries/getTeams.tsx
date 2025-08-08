import gql from 'graphql-tag';

export const GET_TEAMS = gql`
  query getTeams($name: String, $userId: String, $teamIds: [String]) {
    getTeams(name: $name, userId: $userId, teamIds: $teamIds) {
      _id
      icon
      name
      description
      estimateType
      createdAt
      updatedAt
      taskCount
      memberCount
    }
  }
`;
