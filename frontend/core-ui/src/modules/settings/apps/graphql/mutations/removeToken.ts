import { gql } from '@apollo/client';

const REMOVE_TOKEN = gql`
  mutation AppsRemove($_id: String!) {
    appsRemove(_id: $_id)
  }
`;

export { REMOVE_TOKEN };
