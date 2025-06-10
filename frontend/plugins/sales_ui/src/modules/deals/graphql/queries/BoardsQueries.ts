import { gql } from "@apollo/client";

export const GET_BOARDS = gql`
  query salesBoards($type: String!) {
    salesBoards(type: $type) {
      _id
      name

      pipelines {
        _id
        name
      }
    }
  }
`;


export const GET_BOARD_GET_LAST = gql`
  query salesBoardGetLast($type: String!) {
    salesBoardGetLast(type: $type) {
      _id
      name
      pipelines {
        _id
        name
      }
    }
  }
`;

export const GET_BOARD_DETAIL = gql`
  query salesBoardDetail($_id: String!) {
    salesBoardDetail(_id: $_id) {
      _id
      name
      pipelines {
        _id
        name
        visibility
        memberIds
        isWatched
        startDate
        endDate
        state
        itemsTotalCount
        members {
          _id
          email
          username
          details {
            avatar
            fullName
          }
        }
      }
    }
  }
`;

export const GET_BOARD_COUNTS = gql`
  query salesBoardCounts($type: String!) {
    salesBoardCounts(type: $type) {
      _id
      name
      count
    }
  }
`;

export const GET_BOARD_CONTENT_TYPE_DETAIL = gql`
  query salesBoardContentTypeDetail($contentType: String, $contentId: String){
    salesBoardContentTypeDetail(contentType: $contentType, contentId: $contentId)
  }
`;

export const GET_BOARD_LOGS = gql`
  query salesBoardLogs($action: String, $content: JSON, $contentType: String, $contentId: String){
    salesBoardLogs(action: $action, content: $content, contentType: $contentType, contentId: $contentId)
  }
`;

