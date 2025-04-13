export const types = `
    type Log {
      _id: String
      createdAt: Date
      payload:String,
      source:String,
      action:String,
      status:String,
      userId:String,

      user:User
      prevObject:String
    }

    type MainLogsList {
        list:[Log]
        totalCount: Int
    }
`;

export const commonListQueryParams = `
    searchValue:String,
    page:Int,
    perPage:Int,
    ids:[String]
    excludeIds:[String]
`;

const commonQueryParams = `
    ${commonListQueryParams}
    filters:JSON
`;

export const queries = `
    logsMainList(${commonQueryParams}):MainLogsList
`;
export default { types, queries };
