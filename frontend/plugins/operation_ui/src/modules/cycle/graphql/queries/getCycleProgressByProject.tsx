import gql from 'graphql-tag';

export const GET_CYCLE_PROGRESS_BY_PROJECT = gql`
  query getCycleProgressByProject($_id: String!) {
    getCycleProgressByProject(_id: $_id)
  }
`;
