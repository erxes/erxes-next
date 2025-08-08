import gql from 'graphql-tag';

export const GET_TEAMS = gql`
query getTeams($name: String, $userId: String) {
  getTeams(name: $name, userId: $userId) {
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
