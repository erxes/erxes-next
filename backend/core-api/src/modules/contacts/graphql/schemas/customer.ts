export const types = `

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
    totalCount: Int,
  }

`;

export const conformityQueryFields = `
  conformityMainType: String
  conformityMainTypeId: String
  conformityRelType: String
  conformityIsRelated: Boolean
  conformityIsSaved: Boolean
`;

const queryParams = `
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
  sex:Int
  birthDate: Date
  dateFilters: String
  segmentData: String
  emailValidationStatus:String
  limit: Int
  cursor: String
  direction: CURSOR_DIRECTION
  ${conformityQueryFields}
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
