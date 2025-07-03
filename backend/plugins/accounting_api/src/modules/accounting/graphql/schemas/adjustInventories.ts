export const types = `
  type AdjustInvDetail @key(fields: "_id") @cacheControl(maxAge: 3){
    _id: String
    adjustId: String
    createdAt: Date
    updatedAt: Date

    productId: String
    accountId: String
    departmentId: String
    branchId: String

    remainder: Float
    cost: Float
    unitCost: Float
    soonInCount: Float
    soonOutCount: Float

    error: String
    warning: String
    byDate: JSON
  }

  type AdjustInventory @key(fields: "_id") @cacheControl(maxAge: 3){
    _id: String
    createdAt: Date
    createdBy: String
    updatedAt: Date
    modifiedBy: String

    date: Date
    description: String
    status: String
    error: String
    warning: String
    beginDate: Date
    successDate: Date
    checkedDate: Date
  }
`;

const AdjustInventoriesQueryParams = `
  startDate: Date
  endDate: Date
  description: String
  status: String
  error: String
  warning: String
  startBeginDate: Date
  endBeginDate: Date
  startSuccessDate: Date
  endSuccessDate: Date
  startCheckedDate: Date
  endCheckedDate: Date
`;

const adjustInvParams = `
  date: Date
  description: String
  beginDate: Date
  successDate: Date
  checkedDate: Date
`;

export const queries = `
  adjustInventories(
    ${AdjustInventoriesQueryParams},
    page: Int,
    perPage: Int,
    sortField: String
    sortDirection: Int    
  ): [AdjustInventory]
  adjustInventoriesCount(${AdjustInventoriesQueryParams}): Int
  adjustInventoryDetail(_id: String): AdjustInventory
  adjustInventoryDetails(_id: String): [AdjustInvDetail]
  adjustInventoryDetailsCount(_id: String): Int
`;

export const mutations = `
  adjustInventoryAdd(${adjustInvParams}): AdjustInventory
  adjustInventoryPublish(_id: String!): AdjustInventory
  adjustInventoryCancel(_id: String!): AdjustInventory
  adjustInventoryRemove(_id: String!): String
  adjustInventoryRun(adjustId: String!): AdjustInventory
`;
