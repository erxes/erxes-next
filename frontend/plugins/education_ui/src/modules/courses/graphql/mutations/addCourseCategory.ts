import { gql } from '@apollo/client';

export const ADD_COURSE_CATEGORY = gql`
  mutation courseCategoryAdd(
    $name: String!
    $code: String!
    $description: String
    $parentId: String
  ) {
    courseCategoryAdd(
      name: $name
      code: $code
      description: $description
      parentId: $parentId
    ) {
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
