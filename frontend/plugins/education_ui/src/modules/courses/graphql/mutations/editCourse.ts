import { gql } from '@apollo/client';

export const EDIT_COURSE = gql`
  mutation CourseEdit(
    $id: String!
    $name: String!
    $categoryId: String!
    $startDate: Date!
    $unitPrice: Float!
    $type: String!
    $status: String
  ) {
    courseEdit(
      _id: $id
      name: $name
      categoryId: $categoryId
      startDate: $startDate
      unitPrice: $unitPrice
      type: $type
      status: $status
    ) {
      _id
      attachment {
        duration
        name
        size
        type
        url
      }
      categoryId
      commentCount
      createdAt
      deadline
      description
      endDate
      name
      startDate
      status
      type
      unitPrice
    }
  }
`;
