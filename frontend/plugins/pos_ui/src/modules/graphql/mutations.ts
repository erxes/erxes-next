import { gql } from '@apollo/client';
import { posCommonFields } from './queries';

const commonFields = `
  $name: String
  $description: String
  $orderPassword: String
  $scopeBrandIds: [String]
  $pdomain: String
  $erxesAppToken: String
  $productDetails: [String]
  $adminIds: [String]
  $cashierIds: [String]
  $paymentIds: [String]
  $paymentTypes: [JSON]
  $isOnline: Boolean
  $onServer: Boolean
  $branchId: String
  $departmentId: String
  $allowBranchIds: [String]
  $beginNumber: String
  $maxSkipNumber: Int
  $kitchenScreen: JSON
  $waitingScreen: JSON
  $kioskMachine: JSON
  $uiOptions: JSON
  $ebarimtConfig: JSON
  $erkhetConfig: JSON
  $cardsConfig: JSON
  $catProdMappings: [CatProdInput]
  $initialCategoryIds: [String]
  $kioskExcludeCategoryIds: [String]
  $kioskExcludeProductIds: [String]
  $deliveryConfig: JSON
  $checkRemainder: Boolean
  $permissionConfig: JSON
  $allowTypes: [String]
  $isCheckRemainder: Boolean
  $checkExcludeCategoryIds: [String]
  $banFractions: Boolean
`;

const commonVariables = `
  name: $name,
  description: $description,
  orderPassword: $orderPassword,
  scopeBrandIds: $scopeBrandIds,
  pdomain: $pdomain,
  erxesAppToken: $erxesAppToken,
  productDetails: $productDetails,
  adminIds: $adminIds,
  cashierIds: $cashierIds,
  paymentIds: $paymentIds,
  paymentTypes: $paymentTypes,
  isOnline: $isOnline,
  onServer: $onServer,
  branchId: $branchId,
  departmentId: $departmentId,
  allowBranchIds: $allowBranchIds,
  beginNumber: $beginNumber,
  maxSkipNumber: $maxSkipNumber,
  kitchenScreen: $kitchenScreen,
  waitingScreen: $waitingScreen,
  kioskMachine: $kioskMachine,
  uiOptions: $uiOptions,
  ebarimtConfig: $ebarimtConfig,
  erkhetConfig: $erkhetConfig,
  catProdMappings: $catProdMappings,
  initialCategoryIds: $initialCategoryIds,
  kioskExcludeCategoryIds: $kioskExcludeCategoryIds,
  kioskExcludeProductIds: $kioskExcludeProductIds,
  deliveryConfig: $deliveryConfig,
  cardsConfig: $cardsConfig,
  checkRemainder: $checkRemainder,
  permissionConfig: $permissionConfig,
  allowTypes: $allowTypes,
  isCheckRemainder: $isCheckRemainder,
  checkExcludeCategoryIds: $checkExcludeCategoryIds,
  banFractions: $banFractions
`;

const posAdd = gql`
  mutation posAdd(${commonFields}) {
    posAdd(${commonVariables}){
      ${posCommonFields}
    }
  }
`;

const posEdit = gql`
  mutation posEdit($_id: String!, ${commonFields}) {
    posEdit(_id: $_id, ${commonVariables}){
      ${posCommonFields}
    }
  }
`;

const posRemove = gql`
  mutation posRemove($_id: String!) {
    posRemove(_id: $_id)
  }
`;

const updateConfigs = gql`
  mutation posConfigsUpdate($posId:String!, $configsMap: JSON!) {
    posConfigsUpdate(posId: $posId, configsMap: $configsMap)
  }
`;

const brandAdd = gql`
  mutation brandsAdd($name: String!, $description: String, $emailConfig: JSON) {
    brandsAdd(name: $name, description: $description, emailConfig: $emailConfig,) {
      _id
    }
  }
`;

const saveProductGroups = gql`
  mutation productGroupsBulkInsert($posId: String!, $groups: [GroupInput]) {
    productGroupsBulkInsert(posId: $posId, groups: $groups) {
      _id
    }
  }
`;

const saveSlots = gql`
  mutation posSlotBulkUpdate($posId: String!, $slots: [SlotInput]) {
    posSlotBulkUpdate(posId: $posId, slots: $slots) {
      _id
    }
  }
`;

export default {
  posAdd,
  posEdit,
  posRemove,
  updateConfigs,
  brandAdd,
  saveProductGroups,
  saveSlots,
};