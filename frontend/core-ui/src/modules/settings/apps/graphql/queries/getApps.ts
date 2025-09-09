import { gql } from '@apollo/client';

const GET_APPS = gql`
  query Apps {
    apps {
      _id
      accessToken
      allowAllPermission
      createdAt
      expireDate
      isEnabled
      name
      noExpire
      userGroupId
    }
  }
`;

export { GET_APPS };
