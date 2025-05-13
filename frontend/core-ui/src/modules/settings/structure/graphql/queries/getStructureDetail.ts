import { gql } from '@apollo/client';

const GET_STRUCTURE_DETAILS = gql`
  query structureDetail {
    structureDetail {
      _id
      title
      description
      code
      supervisorId
      supervisor {
        _id
        email
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
        __typename
      }
      phoneNumber
      email
      links
      coordinate {
        longitude
        latitude
        __typename
      }
      image {
        url
        name
        type
        size
        __typename
      }
      __typename
    }
  }
`;

export { GET_STRUCTURE_DETAILS };
