import { gql } from '@apollo/client';

export const currentUser = gql`
  query currentUser {
    currentUser {
      _id
      createdAt
      username
      email
      isOwner
      brands {
        _id
        name
      }
      details {
        avatar
        fullName
        birthDate
        shortName
        workStartedDate
        position
        description
        location
      }
      links
      emailSignatures
      getNotificationByEmail

      permissionActions
      configs
      configsConstants
      departmentIds
      branchIds
      isShowNotification
      score
    }
  }
`;
