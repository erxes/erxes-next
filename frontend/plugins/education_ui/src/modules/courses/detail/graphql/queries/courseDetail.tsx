import { gql } from '@apollo/client';

export const COURSE_DETAIL = gql`
  query CourseDetail($_id: String!) {
    courseDetail(_id: $_id) {
      _id
      name
      categoryId
      category {
        _id
        name
        description
        parentId
        code
        order
        isRoot
      }
      description
      createdAt
      type
      attachment {
        url
        name
        type
        size
        duration
      }
      status
      startDate
      endDate
      deadline
      unitPrice
      commentCount
      location
      class {
        _id
        name
        description
        location
        level
        createdAt
        updatedAt
      }
      classId
    }
  }
`;
