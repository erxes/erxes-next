import { gql } from '@apollo/client';

const USERS_INVITE = gql`
  mutation usersInvite($entries: [InvitationEntry]) {
    usersInvite(entries: $entries)
  }
`;

const USERS_RESEND_INVITATION = gql`
  mutation usersResendInvitation($email: String!) {
    usersResendInvitation(email: $email)
  }
`;

const USERS_SET_ACTIVE_STATUS = gql`
  mutation usersSetActiveStatus($_id: String!) {
    usersSetActiveStatus(_id: $_id) {
      _id
    }
  }
`;

const USERS_CONFIRM_INVITATION = gql`
  mutation usersConfirmInvitation(
    $token: String
    $password: String
    $passwordConfirmation: String
    $fullName: String
    $username: String
  ) {
    usersConfirmInvitation(
      token: $token
      password: $password
      passwordConfirmation: $passwordConfirmation
      fullName: $fullName
      username: $username
    ) {
      _id
    }
  }
`;

const mutations = {
  USERS_CONFIRM_INVITATION,
  USERS_INVITE,
  USERS_RESEND_INVITATION,
  USERS_SET_ACTIVE_STATUS,
};

export default mutations;
