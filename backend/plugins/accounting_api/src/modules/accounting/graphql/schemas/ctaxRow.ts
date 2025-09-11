export const types = () => `
  type CtaxRow @key(fields: "_id") @cacheControl(maxAge: 3){
    _id: ID!
    name: String
    number: String
    kind: String
    formula: String
    formulaText: String
    status: String
    percent: Float
  }
`;

const ctaxRowParams = `
  name: String
  number: String
  kind: String
  formula: String
  formulaText: String
  status: String
  percent: Float
`;

const ctaxRowsQueryParams = `
  status: String,
  name: String,
  number: String,
  searchValue: String,
  ids: [String],
  excludeIds: Boolean,
`;

export const queries = `
  ctaxRows(
    ${ctaxRowsQueryParams},
    page: Int,
    perPage: Int,
    sortField: String
    sortDirection: Int    
  ): [CtaxRow]
  ctaxRowsCount(${ctaxRowsQueryParams}): Int
  ctaxRowDetail(_id: ID): CtaxRow
`;

export const mutations = `
  ctaxRowsAdd(${ctaxRowParams}): CtaxRow
  ctaxRowsEdit(_id: ID!, ${ctaxRowParams}): CtaxRow
  ctaxRowsRemove(ctaxRowIds: [String!]): String
`;
