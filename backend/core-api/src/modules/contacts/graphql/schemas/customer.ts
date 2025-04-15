export const types = `

  enum Direction {
    forward,
    backward
  }

  type PageInfo {
    hasNextPage: Boolean,
    hasPreviousPage: Boolean,
    startCursor: String,
    endCursor: String,
  }

  type Customer {
    _id: String
     state: String
    createdAt: Date
    modifiedAt: Date
    avatar: String
    integrationId: String
    firstName: String
    lastName: String
    middleName: String

    birthDate: Date
    sex: Int

    email: String
    primaryEmail: String
    emails: [String]
    primaryPhone: String
    phones: [String]
    primaryAddress: JSON
    addresses: [JSON]

    phone: String
    tagIds: [String]
    remoteAddress: String
    location: JSON
    visitorContactInfo: JSON
    customFieldsData: JSON
    customFieldsDataByFieldCode: JSON
    trackedData: JSON
    ownerId: String
    position: String
    department: String
    leadStatus: String
    hasAuthority: String
    description: String
    isSubscribed: String
    code: String
    emailValidationStatus: String
    phoneValidationStatus: String

    isOnline: Boolean
    lastSeenAt: Date
    sessionCount: Int
    urlVisits: [JSON]
    owner: User
    score: Float
    links: JSON
    companies: [Company]
    getTags: [Tag]
  }

  type CustomersListResponse {
    list: [Customer],
    pageInfo: PageInfo
    totalCount: Float,
  }

`;
export const conformityQueryFields = `
  conformityMainType: String
  conformityMainTypeId: String
  conformityRelType: String
  conformityIsRelated: Boolean
  conformityIsSaved: Boolean
`;

export const paginationQueryFields = `
  limit: Int
  cursor: String
  direction: Direction
`

const queryParams = `
 page: Int
  perPage: Int
  segment: String
  type: String
  tag: String
  ids: [String]
  excludeIds: Boolean
  tags: [String]
  excludeTags: [String]
  tagWithRelated: Boolean
  searchValue: String
  autoCompletion: Boolean
  autoCompletionType: String
  brand: String
  integration: String
  form: String
  startDate: String
  endDate: String
  leadStatus: String
  sortField: String
  sortDirection: Int
  sex:Int
  birthDate: Date
  dateFilters: String
  segmentData: String
  emailValidationStatus:String
  ${conformityQueryFields}
  ${paginationQueryFields}
`;

export const queries = `
  customers(${queryParams}): CustomersListResponse
  customerDetail(_id: String!): Customer
`;

const fields = `
  avatar: String
  firstName: String
  lastName: String
  middleName: String
  primaryEmail: String
  emails: [String]
  primaryPhone: String
  phones: [String]
  primaryAddress: JSON
  addresses: [JSON]
  ownerId: String
  position: String
  department: String
  leadStatus: String
  hasAuthority: String
  description: String
  isSubscribed: String
  links: JSON
  customFieldsData: JSON
  code: String
  sex: Int
  birthDate: Date
  emailValidationStatus: String
  phoneValidationStatus: String
`;

export const mutations = `
  customersAdd(state: String, ${fields}): Customer
  customersEdit(_id: String!, ${fields}): Customer
  customersRemove(customerIds: [String]): [String]
`;
