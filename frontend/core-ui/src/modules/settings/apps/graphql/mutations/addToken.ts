import { gql } from '@apollo/client';

const ADD_TOKEN = gql`
  mutation AppsAdd(
    $name: String
    $userGroupId: String
    $expireDate: Date
    $allowAllPermission: Boolean
    $noExpire: Boolean
  ) {
    appsAdd(
      name: $name
      userGroupId: $userGroupId
      expireDate: $expireDate
      allowAllPermission: $allowAllPermission
      noExpire: $noExpire
    ) {
      _id
      accessToken
      allowAllPermission
      createdAt
      expireDate
      isEnabled
      name
      noExpire
      refreshToken
      userGroupId
    }
  }
`;

export { ADD_TOKEN };
