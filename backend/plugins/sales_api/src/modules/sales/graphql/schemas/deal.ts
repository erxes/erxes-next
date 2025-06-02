export const types = `

  type SalesTimeTrack {
    status: String,
    timeSpent: Int,
    startDate: String
  }

  type DealListItem @key(fields: "_id") {
    _id: String!
    name: String
    companies: JSON
    customers: JSON
    assignedUsers: JSON
    stage: JSON
    labels: JSON
    isComplete: Boolean
    isWatched: Boolean
    relations: JSON
    startDate: Date
    closeDate: Date
    createdAt: Date
    modifiedAt: Date
    priority: String
    hasNotified: Boolean
    score: Float
    number: String
    stageChangedDate: Date
    tagIds: [String]
    customProperties: JSON
    status: String
    branchIds: [String]
    branches:[Branch]
    departmentIds: [String]
    departments:[Department]
    assignedUserIds: [String]
    order: Int,
    createdUserId:String
    tags: [Tag]

    products: JSON
    unusedAmount: JSON
    amount: JSON
    customFieldsData: JSON
  }

  type Deal @key(fields: "_id") {
    _id: String!

    name: String!
    order: Float
    createdAt: Date
    hasNotified: Boolean
    assignedUserIds: [String]
    branchIds: [String]
    departmentIds:[String]
    labelIds: [String]
    startDate: Date
    closeDate: Date
    description: String
    modifiedAt: Date
    modifiedBy: String
    reminderMinute: Int,
    isComplete: Boolean,
    isWatched: Boolean,
    stageId: String
    boardId: String
    priority: String
    status: String
    attachments: [Attachment]
    userId: String
    tagIds: [String]

    assignedUsers: [User]
    stage: SalesStage
    labels: [SalesPipelineLabel]
    pipeline: SalesPipeline
    createdUser: User
    customFieldsData: JSON
    score: Float
    timeTrack: SalesTimeTrack
    number: String
    stageChangedDate: Date

    customProperties: JSON

    unUsedAmount: JSON
    amount: JSON

    companies: [Company]
    customers: [Customer]

    tags: [Tag]

    products: JSON
    productsData: JSON
    paymentsData: JSON
  }

  type DealTotalCurrency {
    amount: Float
    name: String
  }

  type SalesTotalForType {
    _id: String
    name: String
    currencies: [DealTotalCurrency]
  }

  input SalesItemDate {
    month: Int
    year: Int
  }

  input SalesProductField {
    productId : String
    quantity: Int
    unitPrice: Float
  }
`;

const queryParams = `
  _ids: [String]
  date: SalesItemDate
  parentId:String
  pipelineId: String
  pipelineIds: [String]
  customerIds: [String]
  vendorCustomerIds: [String]
  companyIds: [String]
  assignedUserIds: [String]
  productIds: [String]
  closeDateType: String
  labelIds: [String]
  search: String
  priority: [String]
  sortField: String
  sortDirection: Int
  userIds: [String]
  segment: String
  segmentData: String
  assignedToMe: String
  startDate: String
  endDate: String
  hasStartAndCloseDate: Boolean
  stageChangedStartDate: Date
  stageChangedEndDate: Date
  noSkipArchive: Boolean
  tagIds: [String]
  number: String
  branchIds: [String]
  departmentIds: [String]
  boardIds: [String]
  stageCodes: [String]
  dateRangeFilters:JSON,
  createdStartDate: Date,
  createdEndDate: Date
  stateChangedStartDate: Date
  stateChangedEndDate: Date
  startDateStartDate: Date
  startDateEndDate: Date
  closeDateStartDate: Date
  closeDateEndDate: Date
  resolvedDayBetween:[Int]
`;

const archivedDealsParams = `
  pipelineId: String!
  search: String
  userIds: [String]
  priorities: [String]
  assignedUserIds: [String]
  labelIds: [String]
  productIds: [String]
  companyIds: [String]
  customerIds: [String]
  startDate: String
  endDate: String
 `;

export const queries = `
  dealDetail(_id: String!, clientPortalCard: Boolean): Deal
  checkDiscount(_id: String!,products:[SalesProductField], couponCode: String, voucherId: String):JSON
  deals(stageId: String, initialStageId: String, ${queryParams}): [DealListItem]
  dealsTotalCount(stageId: String, initialStageId: String, ${queryParams}): Int
  archivedDeals(page: Int, perPage: Int, ${archivedDealsParams}): [Deal]
  archivedDealsCount(${archivedDealsParams}): Int
  dealsTotalAmounts(${queryParams}): [SalesTotalForType]
`;

const mutationParams = `
  parentId:String,
  proccessId: String,
  aboveItemId: String,
  stageId: String,
  assignedUserIds: [String],
  attachments: [AttachmentInput],
  startDate: Date,
  closeDate: Date,
  description: String,
  order: Int,
  reminderMinute: Int,
  isComplete: Boolean,
  priority: String,
  status: String,
  sourceConversationIds: [String],
  customFieldsData: JSON,
  tagIds: [String],
  branchIds: [String],
  departmentIds: [String],

  paymentsData: JSON,
  productsData: JSON,
  extraData: JSON,
`;

export const mutations = `
  dealsAdd(name: String, companyIds: [String], customerIds: [String], labelIds: [String], ${mutationParams}): Deal
  dealsEdit(_id: String!, name: String, ${mutationParams}): Deal
  dealsChange(itemId: String!, aboveItemId: String, destinationStageId: String!, sourceStageId: String, proccessId: String): Deal
  dealsRemove(_id: String!): Deal
  dealsWatch(_id: String, isAdd: Boolean): Deal
  dealsCopy(_id: String!, proccessId: String): Deal
  dealsArchive(stageId: String!, proccessId: String): String
  dealsCreateProductsData(proccessId: String, dealId: String, docs: JSON): JSON
  dealsEditProductData(proccessId: String, dealId: String, dataId: String, doc: JSON): JSON
  dealsDeleteProductData(proccessId: String, dealId: String, dataId: String): JSON
`;
