const groupCommonFields = `
  posId: String
  description: String
  name: String
  categoryIds: [String]
  excludedCategoryIds: [String]
  excludedProductIds: [String]
`;

const posCommonFields = `
  name: String
  description: String
  orderPassword: String
  scopeBrandIds: [String]
  pdomain: String
  productDetails: [String]
  adminIds: [String]
  cashierIds: [String]
  paymentIds: [String]
  paymentTypes: [JSON]
  isOnline: Boolean
  onServer: Boolean
  branchId: String
  departmentId: String
  allowBranchIds: [String]
  beginNumber: String
  maxSkipNumber: Int
  waitingScreen: JSON
  kitchenScreen: JSON
  kioskMachine: JSON
  uiOptions: JSON
  token: String
  erxesAppToken: String
  ebarimtConfig: JSON
  erkhetConfig: JSON
  initialCategoryIds: [String]
  kioskExcludeCategoryIds: [String]
  kioskExcludeProductIds: [String]
  deliveryConfig: JSON
  cardsConfig: JSON
  checkRemainder: Boolean
  permissionConfig: JSON
  allowTypes: [String]
  isCheckRemainder: Boolean
  checkExcludeCategoryIds: [String]
  banFractions: Boolean
`;

const catProd = `
  _id: String
  categoryId: String
  code: String
  name: String
  productId: String
`;

export const types = () => `
  type CatProd {
    ${catProd}
  }

  type Pos {
    _id: String
    createdAt: Date
    userId: String
    user: User
    ${posCommonFields}
    catProdMappings: [CatProd]

    branchTitle: String
    departmentTitle: String
  }

  type PosSlot {
    _id: String
    posId: String
    code: String
    name: String
    option: JSON
  }

  type ProductGroups {
    _id: String
    name: String
    description: String
    posId: String
    categoryIds: [String]
    excludedCategoryIds: [String]
    excludedProductIds: [String]
  }

  input GroupInput {
    _id: String
    description: String
    name: String
    categoryIds: [String]
    excludedCategoryIds: [String]
    excludedProductIds: [String]
  }

  input SlotInput {
    _id: String
    posId: String!
    code: String
    name: String
    option: JSON
  }

  input CatProdInput {
    ${catProd}
  }
`;

export const queries = `
  posList(page: Int, perPage: Int, isOnline: String, sortField: String, sortDirection: Int): [Pos]
  posDetail(_id: String!): Pos
  posEnv: JSON
  productGroups(posId: String!): [ProductGroups]
  posSlots(posId: String!): [PosSlot]
  ecommerceGetBranches(posToken: String): [JSON]
`;

export const mutations = `
  posAdd(${posCommonFields}, catProdMappings: [CatProdInput]): Pos
  posEdit(_id: String, ${posCommonFields}, catProdMappings: [CatProdInput]): Pos
  posRemove(_id: String!): JSON
  productGroupsAdd(${groupCommonFields}): ProductGroups
  productGroupsBulkInsert(posId: String, groups:[GroupInput]): [ProductGroups]
  posSlotBulkUpdate(posId: String, slots: [SlotInput]): [PosSlot]
`;
