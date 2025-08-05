import { gql } from '@apollo/client';
import { adjustInventoryFields } from './adjustInventoryQueries';

export const ADJUST_INVENTORY_PUBLISH = gql`
  mutation AdjustInventoryPublish($_id: String!) {
    adjustInventoryPublish(_id: $_id) {
      ${adjustInventoryFields}
    }
  }
`;
export const ADJUST_INVENTORY_CANCEL = gql`
  mutation AdjustInventoryCancel($_id: String!) {
    adjustInventoryCancel(_id: $_id) {
      ${adjustInventoryFields}
    }
  }
`;
export const ADJUST_INVENTORY_RUN = gql`
  mutation AdjustInventoryRun($adjustId: String!) {
    adjustInventoryRun(adjustId: $adjustId) {
      ${adjustInventoryFields}
    }
  }
`;
