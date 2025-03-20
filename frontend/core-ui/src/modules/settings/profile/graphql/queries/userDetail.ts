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
      }
      links
      emailSignatures
      getNotificationByEmail
      customFieldsData
      score
      employeeId
      brandIds
    }
  }
`;
