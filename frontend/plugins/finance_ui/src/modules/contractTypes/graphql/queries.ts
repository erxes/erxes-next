import { gql } from '@apollo/client';

export const contractTypeFields = gql`
  _id
  code
  name
  description
  status
  number
  vacancy
  createdAt
  config
  currency
  interestCalcType
  storeInterestInterval
  branchId
  interestRate
  closeInterestRate
  isAllowIncome
  isAllowOutcome
  isDeposit
  productType
  limitPercentage
`;
const listParamsDef = `
  $page: Int
  $perPage: Int
  $ids: [String]
  $searchValue: String
  $sortField: String
  $sortDirection: Int
  $isDeposit: Boolean
  $productType: String
`;

const listParamsValue = `
  page: $page
  perPage: $perPage
  ids: $ids
  searchValue: $searchValue
  sortField: $sortField
  sortDirection: $sortDirection
  isDeposit: $isDeposit
  productType: $productType
`;
const contractTypes = `
  query SavingsContractTypes(${listParamsDef}) {
    savingsContractTypes(${listParamsValue}) {
      ${contractTypeFields}
    }
  }
`;

const contractTypesMain = gql`
  query SavingsContractTypesMain(${listParamsDef}) {
    savingsContractTypesMain(${listParamsValue}) {
      list {
        ${contractTypeFields}
      }
      totalCount
    }
  }
`;

const contractTypeCounts = `
  query contractTypeCounts(${listParamsDef}, $only: String) {
    contractTypeCounts(${listParamsValue}, only: $only)
  }
`;

const contractTypeDetail = `
  query savingsContractTypeDetail($_id: String!) {
    savingsContractTypeDetail(_id: $_id) {
      ${contractTypeFields}
    }
  }
`;

export const contractTypeQueries = {
  contractTypes,
  contractTypesMain,
  contractTypeCounts,
  contractTypeDetail,
};
