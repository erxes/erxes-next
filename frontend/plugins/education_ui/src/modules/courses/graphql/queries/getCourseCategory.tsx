import { gql } from '@apollo/client';

export const GET_COURSE_CATEGORY = gql`
  query CourseCategories($parentId: String, $searchValue: String) {
    courseCategories(parentId: $parentId, searchValue: $searchValue) {
      _id
      name
      description
      parentId
      code
      order
      isRoot
      courseCount
      attachment {
        url
        name
        type
        size
        duration
      }
    }
  }
`;
