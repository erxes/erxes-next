import { gql } from '@apollo/client';

export const ADD_COURSES = gql`
  mutation courseAdd(
    $name: String!
    $categoryId: String!
    $classId: String!
    $startDate: Date!
    $unitPrice: Float!
    $type: String!
    $description: String
    $attachment: AttachmentInput
    $endDate: Date
    $deadline: Date
    $status: String
    $limit: Int
  ) {
    courseAdd(
      name: $name
      categoryId: $categoryId
      classId: $classId
      startDate: $startDate
      unitPrice: $unitPrice
      type: $type
      description: $description
      attachment: $attachment
      endDate: $endDate
      deadline: $deadline
      status: $status
      limit: $limit
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
      classId
      startDate
      status
      type
      limit
      unitPrice
    }
  }
`;
