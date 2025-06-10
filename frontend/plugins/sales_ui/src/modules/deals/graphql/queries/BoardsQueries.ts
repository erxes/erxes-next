import { gql } from "@apollo/client";

export const boards = gql`
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


export const boardGetLast = gql`
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

export const boardDetail = gql`
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

export const boardCounts = gql`
  query salesBoardCounts($type: String!) {
    salesBoardCounts(type: $type) {
      _id
      name
      count
    }
  }
`;

export const boardContentTypeDetail = gql`
  query salesBoardContentTypeDetail($contentType: String, $contentId: String){
    salesBoardContentTypeDetail(contentType: $contentType, contentId: $contentId)
  }
`;

export const boardLogs = gql`
  query salesBoardLogs($action: String, $content: JSON, $contentType: String, $contentId: String){
    salesBoardLogs(action: $action, content: $content, contentType: $contentType, contentId: $contentId)
  }
`;

