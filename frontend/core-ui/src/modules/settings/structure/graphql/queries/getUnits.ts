import { gql } from '@apollo/client';

const GET_UNITS_LIST = gql`
  query Units($searchValue: String) {
    units(searchValue: $searchValue) {
      _id
      code
      departmentId
      description
      supervisorId
      title
      userCount
    }
  }
`;

export { GET_UNITS_LIST };
