import { gql } from '@apollo/client';

export const ACCOUNTING_ADJUST_INVENTORY_CHANGED = gql`
  subscription AccountingAdjustInventoryChanged($_id: String!) {
    accountingAdjustInventoryChanged(_id: $_id) {
      type
    }
  }
`;

export default {
  ACCOUNTING_ADJUST_INVENTORY_CHANGED,
}