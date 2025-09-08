import { gql } from '@apollo/client';

export const CALL_STATISTIC_SUB = gql`
  subscription callStatistic {
    callStatistic {
      extension
      queuename
      callstotal
      member {
        extension
        callerchannel
        calleechannel
        queue_action
      }
    }
  }
`;

export const queueRealtimeUpdate = gql`
  subscription queueRealtimeUpdate($extension: String) {
    queueRealtimeUpdate(extension: $extension)
  }
`;
