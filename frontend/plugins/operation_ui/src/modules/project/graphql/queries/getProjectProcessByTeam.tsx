import gql from 'graphql-tag';

export const GET_PROJECT_PROCESS_BY_TEAM = gql`
  query getProjectProcessByTeam($_id: String!) {
    getProjectProcessByTeam(_id: $_id)
  }
`;
