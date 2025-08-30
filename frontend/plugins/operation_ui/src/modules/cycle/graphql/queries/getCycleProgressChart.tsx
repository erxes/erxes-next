import gql from 'graphql-tag';

export const GET_CYCLE_PROGRESS_CHART = gql`
  query getCycleProgressChart($_id: String!) {
    getCycleProgressChart(_id: $_id)
  }
`;
