import gql from 'graphql-tag';

export const GET_PROJECT_PROCESS_BY_MEMBER = gql`
  query getProjectProcessByMember($_id: String!) {
    getProjectProcessByMember(_id: $_id)
  }
`;
