import gql from 'graphql-tag';

export const GET_TEAM_MEMBERS = gql`
  query getTeamMembers($teamId: String!) {
    getTeamMembers(teamId: $teamId) {
      _id
      memberId
      teamId
      role
    }
  }
`;
