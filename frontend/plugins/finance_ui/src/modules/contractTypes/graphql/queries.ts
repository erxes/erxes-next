import { gql } from '@apollo/client';

export const contractTypeFields = `
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
  $ids: [String]
  $searchValue: String
  $isDeposit: Boolean
  $productType: String
`;

const listParamsValue = `
  ids: $ids
  searchValue: $searchValue
  isDeposit: $isDeposit
  productType: $productType
`;

const contractTypes = gql`
  query SavingsContractTypes(${listParamsDef}) {
    savingsContractTypes(${listParamsValue}) {
      list {
        ${contractTypeFields}
      }
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
