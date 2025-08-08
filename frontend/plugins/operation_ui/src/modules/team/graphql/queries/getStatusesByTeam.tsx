import gql from 'graphql-tag';

export const GET_STATUSES_BY_TEAM = gql`
  query getStatusesByTeam($teamId: String!) {
    getStatusesByTeam(teamId: $teamId) {
      _id
      name
      description
      color
      order
      type
    }
  }
`;
