const posOrderFields = () => `
  _id: ID,
  createdAt: Date,
  status: String,
  paidDate: Date,
  dueDate: Date,
  number: String,
  customerId: String,
  customerType: String,
  cashAmount: Float,
  mobileAmount: Float,
  paidAmounts: JSON,
  totalAmount: Float,
  finalAmount: Float,
  shouldPrintEbarimt: Boolean,
  printedEbarimt: Boolean,
  billType: String,
  billId: String,
  registerNumber: String,
  oldBillId: String,
  type: String,
  userId: String,
  items: JSON,
  posToken: String,
  posName: String,
  branchId: String,
  departmentId: String,
  subBranchId: String,
  branch: JSON,
  department: JSON,
  subBranch: JSON,
  user: User,
  customer: CustomerPos
  syncedErkhet: Boolean,
  description: String,
  isPre: Boolean,
  origin: String,
  convertDealId: String,
  returnInfo: JSON
`;

export const types = () => `
  type CustomerPos {
    _id: ID!
    code: String
    primaryPhone: String
    firstName: String
    primaryEmail: String
    lastName: String
  }

  type PosOrder {
    ${posOrderFields()}
  }

  type PosOrderDetail {
    ${posOrderFields()}
    syncErkhetInfo: String
    putResponses: JSON
    deliveryInfo: JSON
    deal: JSON
    dealLink: String
  }

  type PosOrderRecord {
    ${posOrderFields()}
  }

  type PosOrdersByCustomer {
    _id: ID,
    customerType: String,
    customerDetail:JSON,
    orders:[PosOrder]
    totalOrders:Int,
    totalAmount:Int
  }

  type PosOrdersBySubs {
    _id: ID,
    customerType: String,
    customerId:String,
    customer:JSON,
    status:String
    closeDate:Date
  }

  type PosProduct {
    _id: ID!
    name: String
    code: String
    type: String
    uom: String
    unitPrice: Float
    categoryId: String
    createdAt: Date,
    counts: JSON,
    count: Float,
    amount: Float,
    category: ProductCategory
  }
  type PosProducts {
    products: [PosProduct],
    totalCount: Float,
  }
`;

const commonQueryParams = `
  page: Int
  perPage: Int
  sortField: String
  sortDirection: Int

`;

const queryParams = `
  ${commonQueryParams}
  search: String
  paidStartDate: Date
  paidEndDate: Date
  createdStartDate: Date
  createdEndDate: Date
  paidDate: String
  userId: String
  customerId: String
  customerType: String
  posId: String
  posToken: String
  types: [String]
  statuses: [String]
  excludeStatuses: [String] 
  hasPaidDate: Boolean
  brandId: String
`;

const groupParams = `
  groupField: String
`;

const commonSubsQueryParams = `
  ${commonQueryParams}
  customerId:String,
  userId:String,
  companyId:String,
  status:String,
  closeFrom:String,
  closeTo:String,
`;

export const queries = `
  posOrders(${queryParams}): [PosOrder]
  posOrderDetail(_id: ID): PosOrderDetail
  posProducts(${queryParams} categoryId: String, searchValue: String): PosProducts
  posOrdersSummary(${queryParams}): JSON
  posOrdersGroupSummary(${queryParams}, ${groupParams}): JSON
  posOrdersTotalCount(${queryParams}): JSON
  posOrderRecords(${queryParams}): [PosOrderRecord]
  posOrderRecordsCount(${queryParams}): Int
  posOrderCustomers(${commonQueryParams}):[PosOrdersByCustomer]
  posOrderCustomersTotalCount(${commonQueryParams}):Int
  checkSubscription(customerId:String, productId:String,productIds:[String]): PosOrder
  posOrderBySubscriptions(${commonSubsQueryParams}):[PosOrdersBySubs]
  posOrderBySubscriptionsTotalCount(${commonSubsQueryParams}):Int
`;

export const mutations = `
  posOrderReturnBill(_id: ID!): PosOrder
  posOrderChangePayments(_id: ID!, cashAmount: Float, mobileAmount: Float, paidAmounts: JSON, description: String): PosOrder
`;
