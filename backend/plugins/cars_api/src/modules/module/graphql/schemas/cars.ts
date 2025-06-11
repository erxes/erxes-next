export const types = `
  type Car {
    ownerId: String
    customers: [Customer]
    companies: [Company]

    getTags: [Tag]
    plateNumber: String
    vinNumber: String
    colorCode: String
    category: carCategory
    bodyType: String
    fuelType: String
    gearBox: String
    vintageYear: Float
    importYear: Float
    status: String
    description: String
    tagIds: [String]
    attachment: Attachment
 }

  type CarListResponse {
    list: [Car],
    pageInfo: PageInfo
    totalCount: Float,
  }

`;

const queryParams = `
  page: Int
  perPage: Int
  tag: String
  categoryId: String
  ids: [String]
  searchValue: String
  sortField: String
  sortDirection: Int
  brand: String
`;

export const queries = `
  carDetail(_id: String!): Car
  cars(${queryParams}): CarListResponse
`;

const mutationParams = `
  ownerId: String,
  description: String
  plateNumber: String
  vinNumber: String
  colorCode: String
  categoryId: String
  bodyType: String
  fuelType: String
  gearBox: String
  vintageYear: Float
  importYear: Float
  attachment: AttachmentInput
`;

export const mutations = `
  carsAdd(${mutationParams}): Car
  carsEdit(_id: String!, ${mutationParams}): Car
  carsRemove(_ids: [String]!): Car
  carsMerge(carIds: [String], carFields: JSON): Car
`;
