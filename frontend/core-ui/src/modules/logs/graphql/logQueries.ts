export const LOGS_MAIN_LIST = `
query LogsMainList($searchValue: String, $page: Int, $perPage: Int, $ids: [String], $excludeIds: [String], $filters: JSON) {
  logsMainList(searchValue: $searchValue, page: $page, perPage: $perPage, ids: $ids, excludeIds: $excludeIds, filters: $filters) {
    list {
      _id
      createdAt
      payload
      source
      action
      status
      userId
      user {
        _id
        email
        details {
          avatar
          firstName
          fullName
        }
      }
      prevObject
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
