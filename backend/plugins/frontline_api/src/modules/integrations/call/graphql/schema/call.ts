const integrationCommonFields = `
    _id: String
    inboxId: String
    phone: String
    wsServer: String
    operators: JSON
    token: String
    queues: [String]
    srcTrunk: String
    dstTrunk: String
`;

export const types = `

  type CallsIntegrationDetailResponse {
    ${integrationCommonFields}
  }

  input CallIntegrationConfigs {
    ${integrationCommonFields}
  }

  type CallChannel {
    _id: String!
    name: String!
    description: String
    integrationIds: [String]
    memberIds: [String]
    createdAt: Date
    userId: String!
    conversationCount: Int
    openConversationCount: Int

    members: [User]
  }

  type CallConversation {
    _id: String 
    erxesApiId: String
    integrationId: String
    customerPhone: String
    operatorPhone: String
    callId: String
    channels: [CallChannel]
  }

  type CallConversationDetail {
    customer: Customer
    channels: [CallChannel]
  }
  type CallActiveSession {
    _id: String
    userId: String
    lastLoginDeviceId: String
  }
   type CallHistory{
    _id: String
    operatorPhone: String
    customerPhone: String
    callDuration: Int
    callStartTime: Date
    callEndTime: Date
    callType: String
    callStatus: String
    timeStamp: Float
    modifiedAt: Date
    createdAt: Date
    createdBy: String
    modifiedBy: String
    customer: Customer
    extensionNumber: String
    conversationId: String
    recordUrl: String
  }

  type CallStatistic {
    extension: String
    queuename: String
    strategy: String
    callstotal: Int
    callswaiting: Int
    callscomplete: Int
    callsabandoned: Int
    servicelevel: String
    urgemsg: Int
    newmsg: Int
    oldmsg: Int
    queuechairman: String
    enable_agent_login: String
    abandonedrate: String
    avgwaittime: Int
    avgtalktime: Int
    availablecount: Int
    agentcount: Int
    transferoutcalls: Int
    transferoutrate: String
  }

  type CallAgent {
    extension: String
    member: [AgentMember]
    idlecount: Int
  }

  type AgentMember {
    member_extension: String
    status: String # InUse, Idle, Paused
    membership: String
    answer: Int
    abandon: Int
    logintime: String
    talktime: Int
    pausetime: String
    first_name: String
    last_name: String
    queue_action: String
    pause_reason: String
    # For hangup events
    callerchannel: String
    calleechannel: String
    calleeid: String
  }

  type ActiveCall {
    uniqueid: String
    linkedid: String
    channel: String
    state: String # Ring, Up, Down
    service: String
    callername: String
    callernum: String
    connectedname: String
    connectednum: String
    alloc_time: String
    callid: String
    inbound_trunk_name: String
    outbound_trunk_name: String
    dial_service: String
    feature_num: String
    feature_name: String
    feature_calleenum: String
    feature_calleename: String
    meeting_number: String
    alloc_timestamp: String
    chantype: String
    action: String # add, update, delete
    channel2: String # for bridge events
  }

  type QueueStatus {
    extension: String!
    queuename: String
    totalCalls: Int
    waitingCalls: Int
    completedCalls: Int
    abandonedCalls: Int
    agents: [QueueAgent]
    statistics: CallStatistic
  }

  type QueueAgent {
    extension: String
    name: String
    status: String
    callsAnswered: Int
    callsAbandoned: Int
    talkTime: Int
    pauseTime: String
    pauseReason: String
  }
`;

export const subscriptions = `
  sessionTerminateRequested(userId: String): JSON
  waitingCallReceived(extension: String): String
  talkingCallReceived(extension: String): String
  agentCallReceived(extension: String): String

  callStatistic(extension: String): CallStatistic
  callAgent(extension: String): CallAgent
  activeCallStatus(extension: String): ActiveCall
  queueStatus(extension: String!): QueueStatus
  `;

const commonHistoryFields = `
  operatorPhone: String
  customerPhone: String
  callDuration: Int
  callStartTime: Date
  callEndTime: Date
  callType: String
  callStatus: String
  timeStamp: Float
  inboxIntegrationId: String
  transferredCallStatus: String
  endedBy: String
`;

const mutationFilterParams = `
  callStatus: String
  callType: String
  startDate: String
  endDate: String
  integrationId: String
  searchValue: String
`;

const filterParams = `
  limit: Int,
  ${mutationFilterParams}
`;

export const queries = `
  callsIntegrationDetail(integrationId: String!): CallsIntegrationDetailResponse
  callUserIntegrations: [CallsIntegrationDetailResponse]
  callsCustomerDetail(customerPhone: String): Customer
  callsActiveSession: CallActiveSession
  callHistories(${filterParams}, skip: Int): [CallHistory]
  callHistoriesTotalCount(${filterParams}, skip: Int): Int
  callsGetConfigs: JSON
  callGetAgentStatus: String
  callExtensionList(integrationId: String!): JSON
  callQueueList(integrationId: String!): JSON
  callWaitingList(queue: String!): String
  callProceedingList(queue: String!): String
  callQueueMemberList(integrationId: String!, queue: String!): JSON
  callTodayStatistics(queue: String!): JSON

  getQueueStatus(extension: String!): QueueStatus
  getActiveCalls(extension: String): [ActiveCall]
  getAgentStats(extension: String!, agentExtension: String): [QueueAgent]
  `;

//old mutations

//callTerminateSession: JSON
//callDisconnect: String
//callHistoryAdd(${commonHistoryFields}, queueName: String): CallHistory
//callHistoryEdit(_id: String,${commonHistoryFields}): String
//callHistoryEditStatus(callStatus: String, timeStamp: Float): String

export const mutations = `
  callsIntegrationUpdate(configs: CallIntegrationConfigs): JSON
  callAddCustomer(inboxIntegrationId: String, primaryPhone: String, queueName: String): CallConversationDetail
  callUpdateActiveSession: JSON
  callHistoryAdd(${commonHistoryFields}, queueName: String): CallHistory
  callHistoryRemove(_id: String!): JSON
  callsUpdateConfigs(configsMap: JSON!): JSON
  callsPauseAgent(status: String!, integrationId: String!): String
  callTransfer(extensionNumber: String!, integrationId: String!, direction: String): String
  callSyncRecordFile(acctId: String!, inboxId: String!): String

`;
