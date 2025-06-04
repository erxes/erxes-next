import {
  GQL_CURSOR_PARAM_DEFS,
  GQL_CURSOR_PARAMS,
  GQL_PAGE_INFO,
} from 'erxes-ui';

export const LOGS_MAIN_LIST = `
query LogsMainList(${GQL_CURSOR_PARAM_DEFS},$searchValue: String, $page: Int, $perPage: Int, $ids: [String], $excludeIds: [String], $filters: JSON) {
  logsMainList(${GQL_CURSOR_PARAMS},searchValue: $searchValue, page: $page, perPage: $perPage, ids: $ids, excludeIds: $excludeIds, filters: $filters) {
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
    ${GQL_PAGE_INFO}
  }
}
`;
