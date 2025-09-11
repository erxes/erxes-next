import gql from 'graphql-tag';

export const GET_CYCLE_PROGRESS_BY_PROJECT = gql`
  query getCycleProgressByProject($_id: ID!, $assigneeId: String) {
    getCycleProgressByProject(_id: $_id, assigneeId: $assigneeId)
  }
`;
