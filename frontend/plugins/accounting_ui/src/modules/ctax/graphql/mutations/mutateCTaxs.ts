import { CTAX_ROW_FIELDS } from '../queries/getCTaxs';

const CTAX_ROW_INPUT_PARAMS_DEFS = `
  $name: String
  $number: String
  $kind: String
  $formula: String
  $formulaText: String
  $status: String
  $percent: Float
`;

const CTAX_ROW_INPUT_PARAMS = `
  name: $name
  number: $number
  kind: $kind
  formula: $formula
  formulaText: $formulaText
  status: $status
  percent: $percent
`;

const CTAX_ROWS_ADD = `
  mutation ctaxRowsAdd(${CTAX_ROW_INPUT_PARAMS_DEFS}) {
    ctaxRowsAdd(${CTAX_ROW_INPUT_PARAMS}) {
      ${CTAX_ROW_FIELDS}
    }
  }
`;

const CTAX_ROWS_EDIT = `
  mutation ctaxRowsEdit($_id: String!${CTAX_ROW_INPUT_PARAMS_DEFS}) {
    ctaxRowsEdit(_id: $_id, ${CTAX_ROW_INPUT_PARAMS}) {
      ${CTAX_ROW_FIELDS}
    }
  }
`;

const CTAX_ROWS_REMOVE = `
  mutation ctaxRowsRemove($ctaxRowIds: [String!]) {
    ctaxRowsRemove(ctaxRowIds: $ctaxRowIds)
  }
`;

export default {
  CTAX_ROWS_ADD,
  CTAX_ROWS_EDIT,
  CTAX_ROWS_REMOVE,
};
