import { gql } from '@apollo/client';

export const CTAX_ROW_FIELDS = `
  _id
  name
  number
  kind
  formula
  formulaText
  status
  percent
`;

export const CTAX_ROWS_FILTER_PARAM_DEFS = `
  $status: String,
  $searchValue: String,
  $ids: [String],
  $excludeIds: Boolean,
`;

export const CTAX_ROWS_FILTER_PARAMS = `
  status: $status,
  searchValue: $searchValue,
  ids: $ids,
  excludeIds: $excludeIds,
`;

export const COMMON_PARAM_DEFS = `
  $page: Int,
  $perPage: Int,
  $sortField: String,
  $sortDirection: Int
`;

export const COMMON_PARAMS = `
  page: $page,
  perPage: $perPage
  sortField: $sortField,
  sortDirection: $sortDirection
`;

export const CTAX_ROWS = gql`
  query ctaxRows(${CTAX_ROWS_FILTER_PARAM_DEFS}, ${COMMON_PARAM_DEFS}) {
    ctaxRows(${CTAX_ROWS_FILTER_PARAMS}, ${COMMON_PARAMS}) {
      ${CTAX_ROW_FIELDS}
    }
    ctaxRowsCount(${CTAX_ROWS_FILTER_PARAMS})
  }
`;

export const CTAX_ROW_DETAIL = gql`
  query ctaxRowDetail($_id: String!) {
    ctaxRowDetail(_id: $_id) {
      ${CTAX_ROW_FIELDS}
    }
  }
`;
