import { gql } from '@apollo/client';

export const ResetPassword = gql`
  mutation resetPassword($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password)
  }
`;
