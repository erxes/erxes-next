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
  getCar(_id: String!): Car
  getCars(${queryParams}): [Car]
  carsCount(${queryParams}, only: String): Int
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
  createCar(${mutationParams}): Car
  updateCar(_id: String!, ${mutationParams}): Car
  removeCar(_id: String!): Car
`;
