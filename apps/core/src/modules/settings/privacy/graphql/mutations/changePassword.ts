import { gql } from '@apollo/client';

export const usersChangePassword = gql`
  mutation usersChangePassword(
    $currentPassword: String!
    $newPassword: String!
  ) {
    usersChangePassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      _id
    }
  }
`;
