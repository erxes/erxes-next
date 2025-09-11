import gql from 'graphql-tag';

export const GET_PROJECT_PROGRESS_CHART = gql`
  query getProjectProgressChart($_id: ID!) {
    getProjectProgressChart(_id: $_id)
  }
`;
