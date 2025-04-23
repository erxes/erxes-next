import { gql } from '@apollo/client';

export const ADD_COURSES = gql`
  mutation courseAdd(
    $name: String!
    $code: String!
    $categoryId: String!
    $startDate: Date!
    $unitPrice: Float!
    $type: String
    $description: String
    $attachment: AttachmentInput
    $endDate: Date
    $deadline: Date
    $status: String
  ) {
    courseAdd(
      name: $name
      code: $code
      categoryId: $categoryId
      startDate: $startDate
      unitPrice: $unitPrice
      type: $type
      description: $description
      attachment: $attachment
      endDate: $endDate
      deadline: $deadline
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
      code
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
