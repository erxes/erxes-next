import { gql } from '@apollo/client';

export const userDetail = gql`
  query userDetail($_id: String) {
    userDetail(_id: $_id) {
      _id
      username
      email
      isActive
      status
      groupIds
      branchIds
      departmentIds
      positionIds
      positions {
        _id
        title
        __typename
      }
      details {
        avatar
        fullName
        shortName
        birthDate
        position
        workStartedDate
        location
        description
        operatorPhone
        firstName
        middleName
        lastName
        __typename
      }
      links
      emailSignatures
      getNotificationByEmail
      customFieldsData
      score
      employeeId
      brandIds
      __typename
    }
  }
`;
