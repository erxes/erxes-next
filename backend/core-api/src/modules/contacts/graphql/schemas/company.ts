export const types = `
  type Company {
    createdAt: Date
    modifiedAt: Date
    avatar: String

    size: Int
    website: String
    industry: String
    plan: String
    parentCompanyId: String
    ownerId: String
    mergedIds: [String]

    names: [String]
    primaryName: String
    emails: [String]
    primaryEmail: String
    phones: [String]
    primaryPhone: String
    primaryAddress: JSON
    addresses: [JSON]

    businessType: String
    description: String
    isSubscribed: String
    links: JSON
    owner: User
    parentCompany: Company

    tagIds: [String]

    customFieldsData: JSON
    customFieldsDataByFieldCode: JSON
    trackedData: JSON

    code: String
    location: String
    score: Float
  }

  type CompaniesListResponse {
    list: [Company],
    totalCount: Float,
  }
`;

const queryParams = `
  page: Int
  perPage: Int
  segment: String
  tag: String
  tags: [String]
  excludeTags: [String]
  tagWithRelated: Boolean
  ids: [String]
  excludeIds: Boolean
  searchValue: String
  autoCompletion: Boolean
  autoCompletionType: String
  sortField: String
  sortDirection: Int
  brand: String
  dateFilters: String
  segmentData: String
`;

export const queries = `
  companiesMain(${queryParams}): CompaniesListResponse
  companyDetail(_id: String!): Company
`;

const mutationParams = `
  avatar: String,

  primaryName: String,
  names: [String]

  primaryPhone: String,
  phones: [String],

  primaryEmail: String,
  emails: [String],

  primaryAddress: JSON,
  addresses: [JSON],

  size: Int,
  website: String,
  industry: String,

  parentCompanyId: String,
  email: String,
  ownerId: String,
  businessType: String,
  description: String,
  isSubscribed: String,
  links: JSON,

  tagIds: [String]
  customFieldsData: JSON
  code: String
  location: String
`;

export const mutations = `
  companiesAdd(${mutationParams}): Company
  companiesEdit(_id: String!, ${mutationParams}): Company
  companiesRemove(companyIds: [String]): [String]
  companiesMerge(companyIds: [String], companyFields: JSON) : Company
`;
