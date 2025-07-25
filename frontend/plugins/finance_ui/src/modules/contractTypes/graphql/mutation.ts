import { contractTypeFields } from './queries';
import { gql } from '@apollo/client';

const commonFields = `
  $code: String,
  $name: String,
  $number: String,
  $vacancy: Float,
  $isAllowIncome:Boolean,
  $isDeposit:Boolean,
  $interestCalcType:String,
  $interestRate: Float,
  $closeInterestRate: Float,
  $description:String,
  $currency:String,
  $limitPercentage: Float
`;

const commonVariables = `
  code:$code
  name:$name
  number:$number
  vacancy:$vacancy
  createdAt:$createdAt
  config:$config
  isAllowIncome:$isAllowIncome
  isAllowOutcome:$isAllowOutcome
  interestCalcType:$interestCalcType
  interestRate:$interestRate,
  closeInterestRate:$closeInterestRate,
  storeInterestInterval:$storeInterestInterval,
  description:$description,
  currency:$currency,
  branchId:$branchId,
  isDeposit:$isDeposit,
  productType: $productType
  limitPercentage: $limitPercentage
`;

const contractTypesAdd = gql`
  mutation savingsContractTypesAdd(${commonFields}) {
    savingsContractTypesAdd(${commonVariables}) {
      ${contractTypeFields}
    }
  }
`;

const contractTypesEdit = gql`
  mutation savingsContractTypesEdit($_id: String!, ${commonFields}) {
    savingsContractTypesEdit(_id: $_id, ${commonVariables}) {
      ${contractTypeFields}
    }
  }
`;

const contractTypesRemove = gql`
  mutation savingsContractTypesRemove($contractTypeIds: [String]) {
    savingsContractTypesRemove(contractTypeIds: $contractTypeIds)
  }
`;

export const contractTypesMutations = {
  contractTypesAdd,
  contractTypesEdit,
  contractTypesRemove,
};

export const EDIT_CONTRACTTYPE = gql`
  mutation savingsContractTypesEdit(
    $_id: String!
    $code: String!
    $name: String!
    $number: String!
    $vacancy: Float
    $isAllowIncome: Boolean
    $isDeposit: Boolean
    $isAllowOutcome: Boolean
    $interestCalcType: String
    $interestRate: Float
    $closeInterestRate: Float
    $description: String
    $currency: String
    $limitPercentage: Float
  ) {
    savingsContractTypesEdit(
      _id: $_id
      code: $code
      name: $name
      number: $number
      vacancy: $vacancy
      isAllowIncome: $isAllowIncome
      isDeposit: $isDeposit
      isAllowOutcome: $isAllowOutcome
      interestCalcType: $interestCalcType
      interestRate: $interestRate
      closeInterestRate: $closeInterestRate
      description: $description
      currency: $currency
      limitPercentage: $limitPercentage
    ) {
      _id
    }
  }
`;
