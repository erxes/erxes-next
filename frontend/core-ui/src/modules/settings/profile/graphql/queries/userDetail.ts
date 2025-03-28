import { gql } from '@apollo/client';

export const GET_USER_DETAIL = gql`
  query GET_USER_DETAIL($_id: String) {
    GET_USER_DETAIL(_id: $_id) {
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
