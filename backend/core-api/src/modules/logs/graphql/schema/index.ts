export const types = `
    type Log {
      _id: String
      createdAt: Date
      payload:String,
      source:String,
      action:String,
      status:String,
      userId:String,
      cursor:String,

      user:User
      prevObject:String
    }

    type MainLogsList {
        list:[Log]
        totalCount: Int
        pageInfo: PageInfo
    }
`;

const cursorParams = `
  limit: Int
  cursor: String
  direction: CURSOR_DIRECTION
  cursorMode: CURSOR_MODE
`;

export const commonListQueryParams = `
    searchValue:String,
    page:Int,
    perPage:Int,
    ids:[String]
    excludeIds:[String]
`;

const commonQueryParams = `
    ${commonListQueryParams},
    ${cursorParams},
    filters:JSON
`;

export const queries = `
    logsMainList(${commonQueryParams}):MainLogsList
`;
export default { types, queries };
