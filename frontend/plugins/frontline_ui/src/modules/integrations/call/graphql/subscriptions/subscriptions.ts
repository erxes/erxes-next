import { gql } from '@apollo/client';

export const queueRealtimeUpdate = gql`
  subscription queueRealtimeUpdate($extension: String) {
    queueRealtimeUpdate(extension: $extension)
  }
`;
