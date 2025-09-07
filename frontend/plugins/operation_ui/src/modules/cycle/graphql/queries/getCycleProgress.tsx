import gql from 'graphql-tag';

export const GET_CYCLE_PROGRESS = gql`
  query getCycleProgress($_id: String!) {
    getCycleProgress(_id: $_id)
  }
`;
