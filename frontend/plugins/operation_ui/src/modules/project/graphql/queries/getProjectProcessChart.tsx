import gql from 'graphql-tag';

export const GET_PROJECT_PROCESS_CHART = gql`
  query getProjectProcessChart($_id: String!) {
    getProjectProcessChart(_id: $_id)
  }
`;
