import gql from 'graphql-tag';

export const GET_PROJECT_PROCESS = gql`
  query getProjectProcess($_id: String!) {
    getProjectProcess(_id: $_id)
  }
`;
