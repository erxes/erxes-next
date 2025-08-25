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

export const QUEUE_STATS_SUBSCRIPTION = gql`
  subscription QueueStatistics($extension: String) {
    callStatistic(extension: $extension) {
      extension
      queuename
      callstotal
      callswaiting
      callscomplete
      callsabandoned
      abandonedrate
      avgwaittime
      avgtalktime
      availablecount
      agentcount
    }
  }
`;

// Real-time agent status
export const AGENT_STATUS_SUBSCRIPTION = gql`
  subscription AgentStatus($extension: String) {
    callAgent(extension: $extension) {
      extension
      idlecount
      member {
        member_extension
        status
        first_name
        last_name
        answer
        abandon
        talktime
        pausetime
        pause_reason
      }
    }
  }
`;

// Real-time active calls
export const ACTIVE_CALLS_SUBSCRIPTION = gql`
  subscription ActiveCalls($extension: String) {
    activeCallStatus(extension: $extension) {
      uniqueid
      channel
      state
      callername
      callernum
      connectednum
      action
      alloc_time
      inbound_trunk_name
    }
  }
`;

// Combined queue status
export const QUEUE_STATUS_SUBSCRIPTION = gql`
  subscription QueueStatus($extension: String!) {
    queueStatus(extension: $extension) {
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
        pauseTime
        pauseReason
      }
      statistics {
        avgwaittime
        avgtalktime
        abandonedrate
        availablecount
        agentcount
      }
    }
  }
`;
