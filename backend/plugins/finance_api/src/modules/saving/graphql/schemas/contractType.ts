export const types = `
  type SavingContractType {
    _id: ID!
    code: String
    name: String
    description: String
    status: String
    number: String
    vacancy: Float
    createdAt: Date
    config: JSON
    currency:String
    interestCalcType: String
    interestRate: Float
    closeInterestRate: Float
    storeInterestInterval: String
    branchId: String
    isAllowIncome: Boolean
    isAllowOutcome: Boolean
    isDeposit: Boolean
    productType: String
    limitPercentage: Float
  }

  type SavingContractTypesListResponse {
    list: [SavingContractType],
    totalCount: Float,
  }
`;

const queryParams = `
  ids: [String]
  excludeIds: Boolean
  searchValue: String
  isDeposit: Boolean
  productType: String
`;

export const queries = `
  savingsContractTypesMain(${queryParams}): SavingContractTypesListResponse
  savingsContractTypes(${queryParams}): [SavingContractType]
  savingsContractTypeDetail(_id: ID!): SavingContractType
`;

const mutationParams = `
  code: String
  name: String
  description: String
  status: String
  number: String
  vacancy: Float
  createdAt: Date
  config: JSON
  currency:String
  interestCalcType: String
  storeInterestInterval: String
  interestRate: Float
  closeInterestRate: Float
  branchId: String
  isAllowIncome: Boolean
  isAllowOutcome: Boolean
  isDeposit: Boolean
  productType: String
  limitPercentage: Float
`;

export const mutations = `
  savingsContractTypesAdd(${mutationParams}): SavingContractType
  savingsContractTypesEdit(_id: ID!, ${mutationParams}): SavingContractType
  savingsContractTypesRemove(contractTypeIds: [String]): JSON
`;
