// import { accountFields } from '../../settings/accounts/graphql/queries';
// import { ctaxRowFields } from '../../settings/ctaxRows/graphql/queries';
// import { vatRowFields } from '../../settings/vatRows/graphql/queries';

import { gql } from '@apollo/client';

const followTrType = `
  type
  id
`;

export const commonTrDetailFields = `
  _id
  accountId
  transactionId
  originId
  followInfos
  follows {
    ${followTrType}
  }

  side
  amount
  currencyAmount
  customRate
  assignedUserId

  productId
  count
  unitPrice
`;

export const commonTransactionFields = `
  _id
  ptrId
  parentId
  number
  ptrStatus
  createdAt
  modifiedAt

  date
  description
  status
  journal
  originId
  follows {
    ${followTrType}
  }

  branchId
  departmentId
  customerType
  customerId
  assignedUserIds

  branch {
    _id
    title
  }

  department {
    _id
    title
  }

  details {
    ${commonTrDetailFields}
  }
  shortDetail {
    ${commonTrDetailFields}
  }
  sumDt
  sumCt
  createdBy
  modifiedBy

  followTrs {
    _id
    ptrId
    parentId
    number
    ptrStatus
    details {
      ${commonTrDetailFields}
    }
    shortDetail {
      ${commonTrDetailFields}
    }
    sumDt
    sumCt
  }

  hasVat
  vatRowId
  afterVat
  isHandleVat
  vatAmount

  hasCtax
  ctaxRowId
  isHandleCtax
  ctaxAmount

  permission
`;

const accountsFilterParamDefs = `
  $ids: [String],
  $excludeIds: Boolean,
  $status: String,
  $searchValue: String,
  $number: String,

  $accountIds: [String],
  $accountType: String,
  $accountExcludeIds: Boolean,
  $accountStatus: String,
  $accountCategoryId: String,
  $accountSearchValue: String,
  $accountBrand: String,
  $accountIsTemp: Boolean,
  $accountIsOutBalance: Boolean,
  $accountBranchId: String,
  $accountDepartmentId: String,
  $accountCurrency: String,
  $accountJournal: String,

  $brandId: String,
  $isOutBalance: Boolean,
  $branchId: String,
  $departmentId: String,
  $currency: String,
  $journal: String,
  $statuses: [String],
`;

const accountsFilterParams = `
  ids: $ids,
  excludeIds: $excludeIds,
  status: $status,
  searchValue: $searchValue,
  number: $number,

  accountIds: $accountIds,
  accountType: $accountType,
  accountExcludeIds: $accountExcludeIds,
  accountStatus: $accountStatus,
  accountCategoryId: $accountCategoryId,
  accountSearchValue: $accountSearchValue,
  accountBrand: $accountBrand,
  accountIsTemp: $accountIsTemp,
  accountIsOutBalance: $accountIsOutBalance,
  accountBranchId: $accountBranchId,
  accountDepartmentId: $accountDepartmentId,
  accountCurrency: $accountCurrency,
  accountJournal: $accountJournal,

  brandId: $brandId,
  isOutBalance: $isOutBalance,
  branchId: $branchId,
  departmentId: $departmentId,
  currency: $currency,
  journal: $journal,
  statuses: $statuses,
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

export const TRANSACTIONS_QUERY = gql`
  query accTransactions(${accountsFilterParamDefs}, ${commonParamDefs}) {
    accTransactions(${accountsFilterParams}, ${commonParams}) {
      ${commonTransactionFields}
    }
    accTransactionsCount(${accountsFilterParams})
  }
`;

export const TRANSACTION_DETAIL_QUERY = gql`
  query accTransactionDetail($_id: String!) {
    accTransactionDetail(_id: $_id) {
      ${commonTransactionFields}
    }
  }
`;
