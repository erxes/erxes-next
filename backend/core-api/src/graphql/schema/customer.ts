export const types = `

  type Customer {
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

    hasAuthority: String
    description: String
    isSubscribed: String
    code: String
    emailValidationStatus: String
    phoneValidationStatus: String

    links: JSON
  }

  type CustomersListResponse {
    list: [Customer],
    totalCount: Float,
  }

`;

const queryParams = `
  page: Int
  perPage: Int
  searchValue: String
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
  description: String
  links: JSON
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
