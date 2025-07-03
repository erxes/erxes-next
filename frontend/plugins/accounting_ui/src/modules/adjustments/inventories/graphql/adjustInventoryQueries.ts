import { gql } from '@apollo/client';

export const adjustInventoryFields = `
  _id
  createdAt
  createdBy
  updatedAt
  modifiedBy

  date
  description
  status
  error
  warning
  beginDate
  successDate
  checkedDate
`;

const adjustInvFilterParamDefs = `
  $startDate: Date
  $endDate: Date
  $description: String
  $status: String
  $error: String
  $warning: String
  $startBeginDate: Date
  $endBeginDate: Date
  $startSuccessDate: Date
  $endSuccessDate: Date
  $startCheckedDate: Date
  $endCheckedDate: Date
`;

const adjustInvFilterParams = `
  startDate: $startDate
  endDate: $endDate
  description: $description
  status: $status
  error: $error
  warning: $warning
  startBeginDate: $startBeginDate
  endBeginDate: $endBeginDate
  startSuccessDate: $startSuccessDate
  endSuccessDate: $endSuccessDate
  startCheckedDate: $startCheckedDate
  endCheckedDate: $endCheckedDate
`;

const commonParamDefs = `
  $page: Int,
  $perPage: Int,
  $sortField: String,
  $sortDirection: Int
`;

const commonParams = `
  page: $page,
  perPage: $perPage
  sortField: $sortField,
  sortDirection: $sortDirection
`;

export const ADJUST_INVENTORIES_QUERY = gql`
  query AdjustInventories(${adjustInvFilterParamDefs}, ${commonParamDefs}) {
    adjustInventories(${adjustInvFilterParams}, ${commonParams}) {
      ${adjustInventoryFields}
    }
    adjustInventoriesCount(${adjustInvFilterParams})
  }
`
export const ADJUST_INVENTORY_DETAIL_QUERY = gql`
  query AdjustInventoryDetail($_id: String!) {
    adjustInventoryDetail(_id: $_id) {
      ${adjustInventoryFields}
    }
  }
`;