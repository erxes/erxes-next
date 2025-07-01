import { contractTypeFields } from './queries';
import { gql } from '@apollo/client';

const commonFields = `
  $code: String,
  $name: String,
  $status: String,
  $number: String,
  $vacancy: Float,
  $createdAt: Date,
  $config: JSON,
  $isAllowIncome:Boolean,
  $isAllowOutcome:Boolean,
  $isDeposit:Boolean,
  $interestCalcType:String,
  $interestRate: Float,
  $closeInterestRate: Float,
  $storeInterestInterval:String,
  $description:String,
  $currency:String,
  $branchId:String,
  $productType: String
  $limitPercentage: Float
`;

const commonVariables = `
  code:$code
  name:$name
  status:$status
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
