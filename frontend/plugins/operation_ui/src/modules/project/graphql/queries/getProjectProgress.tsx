import gql from 'graphql-tag';

export const GET_PROJECT_PROGRESS = gql`
  query getProjectProgress($_id: ID!) {
    getProjectProgress(_id: $_id)
  }
`;
