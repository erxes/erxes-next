import gql from 'graphql-tag';

export const GET_QUEUE_STATUS = gql`
  query GetQueueStatus($extension: String!) {
    getQueueStatus(extension: $extension) {
      extension
      queuename
      totalCalls
      waitingCalls
      completedCalls
      abandonedCalls
      agents {
        extension
        name
        status
        callsAnswered
        talkTime
      }
    }
  }
`;

// Get active calls
export const GET_ACTIVE_CALLS = gql`
  query GetActiveCalls($extension: String) {
    getActiveCalls(extension: $extension) {
      uniqueid
      channel
      state
      callername
      callernum
      connectednum
      alloc_time
      inbound_trunk_name
    }
  }
`;

// Get agent statistics
export const GET_AGENT_STATS = gql`
  query GetAgentStats($extension: String!, $agentExtension: String) {
    getAgentStats(extension: $extension, agentExtension: $agentExtension) {
      extension
      name
      status
      callsAnswered
      callsAbandoned
      talkTime
    }
  }
`;
