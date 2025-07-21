import { gql } from '@apollo/client';

export const GET_BRANCH_LIST = gql`
  query BmsBranchList(
    $limit: Int
    $cursor: String
    $cursorMode: CURSOR_MODE
    $direction: CURSOR_DIRECTION
    $orderBy: JSON
  ) {
    bmsBranchList(
      limit: $limit
      cursor: $cursor
      cursorMode: $cursorMode
      direction: $direction
      orderBy: $orderBy
    ) {
      list {
        _id
        createdAt
        userId
        user {
          _id
          username
          email
          details {
            avatar
            fullName
            shortName
          }
        }
        name
        description
        generalManagerIds
        managerIds
        paymentIds
        paymentTypes
        departmentId
        token
        erxesAppToken
        permissionConfig
        uiOptions
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const BRANCH_LIST_DETAIL = gql`
  query BmsBranchDetail($id: String!) {
    bmsBranchDetail(_id: $id) {
      _id
      createdAt
      userId
      user {
        _id
        username
        email
        details {
          avatar
          fullName
          shortName
        }
      }
      name
      description
      generalManagerIds
      managerIds
      paymentIds
      paymentTypes
      departmentId
      token
      erxesAppToken
      permissionConfig
      uiOptions
    }
  }
`;
