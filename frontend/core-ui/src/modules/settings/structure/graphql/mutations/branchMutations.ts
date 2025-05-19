import { gql } from '@apollo/client';

const ADD_BRANCH = gql`
  mutation BranchesAdd(
    $userIds: [String]
    $coordinate: CoordinateInput
    $image: AttachmentInput
    $radius: Int
    $title: String
    $address: String
    $supervisorId: String
    $code: String
    $parentId: String
    $phoneNumber: String
    $email: String
    $links: JSON
  ) {
    branchesAdd(
      userIds: $userIds
      coordinate: $coordinate
      image: $image
      radius: $radius
      title: $title
      address: $address
      supervisorId: $supervisorId
      code: $code
      parentId: $parentId
      phoneNumber: $phoneNumber
      email: $email
      links: $links
    ) {
      _id
      address
      code
      parentId
      userCount
      title
    }
  }
`;

const REMOVE_BRANCHES = gql`
  mutation BranchesRemove($ids: [String!]) {
    branchesRemove(ids: $ids)
  }
`;

export { ADD_BRANCH, REMOVE_BRANCHES };
