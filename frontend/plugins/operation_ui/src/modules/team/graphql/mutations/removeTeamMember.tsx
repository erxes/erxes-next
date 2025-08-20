import gql from 'graphql-tag';

export const REMOVE_TEAM_MEMBER = gql`
  mutation teamRemoveMember($_id: String!) {
    teamRemoveMember(_id: $_id) {
      _id
    }
  }
`;
