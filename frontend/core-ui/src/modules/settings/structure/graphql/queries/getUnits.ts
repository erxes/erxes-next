import { gql } from '@apollo/client';

const GET_UNITS_LIST = gql`
  query Units($searchValue: String) {
    unitsMain(searchValue: $searchValue) {
      list {
        _id
        code
        departmentId
        description
        supervisorId
        supervisor {
          _id
          details {
            fullName
            avatar
          }
        }
        title
        userCount
      }
      totalCount
    }
  }
`;

export { GET_UNITS_LIST };
