import { gql } from '@apollo/client';

export const CHANGE_COURSE_STATUS = gql`
  mutation ChangeCourseStatus($id: String!, $status: StatusType) {
    changeCourseStatus(_id: $id, status: $status) {
      _id
      name
      code
      categoryId
      description
      createdAt
      type
      status
      startDate
      endDate
      deadline
      unitPrice
      commentCount
    }
  }
`;
