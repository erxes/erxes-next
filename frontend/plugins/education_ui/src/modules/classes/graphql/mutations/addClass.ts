import { gql } from '@apollo/client';

export const ADD_CLASS = gql`
  mutation classAdd(
    $level: String!
    $name: String
    $description: String
    $location: String
  ) {
    classAdd(
      level: $level
      name: $name
      description: $description
      location: $location
    ) {
      _id
      description
      location
      level
      createdAt
      updatedAt
    }
  }
`;
