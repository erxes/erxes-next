import { gql } from '@apollo/client';

export const UpdateProfile = gql`
  mutation usersEditProfile(
    $username: String!
    $email: String!
    $details: UserDetails
    $links: JSON
    $employeeId: String
  ) {
    usersEditProfile(
      username: $username
      email: $email
      details: $details
      links: $links
      employeeId: $employeeId
    ) {
      _id
    }
  }
`;
