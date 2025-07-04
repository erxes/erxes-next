import { gql } from '@apollo/client';
import { adjustInventoryFields } from './adjustInventoryQueries';

const adjInvInputParamDefs = `
  $date: Date
  $description: String
  $beginDate: Date
  $successDate: Date
  $checkedDate: Date
`;

const adjInvInputParams = `
  date: $date
  description: $description
  beginDate: $beginDate
  successDate: $successDate
  checkedDate: $checkedDate
`;

export const ADJUST_INVENTORY_ADD = gql`
  mutation AdjustInventoryAdd(${adjInvInputParamDefs}) {
    adjustInventoryAdd(${adjInvInputParams}) {
      ${adjustInventoryFields}
    }
  }
`;
