import { cursorParams } from '@/inbox/graphql/schemas/conversation';
export const types = `
  input InputRule {
    _id : String!,
    kind: String!,
    text: String!,
    condition: String!,
    value: String,
  }

  type CloudflareCallDataDepartment {
    _id: ID
    name: String
    operators: JSON
  }
  type CloudflareCallsData {
    header: String
    description: String
    secondPageHeader: String
    secondPageDescription: String
    departments: [CloudflareCallDataDepartment]
    isReceiveWebCall: Boolean
  }
    type Form {
      _id: ID
      title: String
      code: String
    }
  type Integration @key(fields: "_id") {
   _id: ID!
    kind: String!
    name: String!
    brandId: String!
    languageCode: String
    code: String
    formId: String
    tagIds: [String]
    createdAt: Date
    tags: [Tag]

    leadData: JSON
    messengerData: JSON
    ticketData: JSON
    uiOptions: JSON
    isActive: Boolean
    isConnected: Boolean
    webhookData: JSON

    brand: Brand

    channels: [Channel]


    healthStatus: JSON
    form : Form

    visibility: String
    departmentIds: [String]

    details: JSON
    callData: CloudflareCallsData
  }
  type IntegrationRespone {
    list: [Integration],
    pageInfo: PageInfo
    totalCount: Int,
  }

  type integrationsTotalCount {
    total: Int
    byTag: JSON
    byChannel: JSON
    byBrand: JSON
    byKind: JSON
    byStatus: JSON
  }

  type integrationsGetUsedTypes {
    _id: ID
    name: String
  }

  input BotPersistentMenuTypeMessenger {
    _id: ID
    type: String
    text: String
    link: String
    isEditing: Boolean
  }
  input MessengerOnlineHoursSchema {
    _id: ID
    day: String
    from: String
    to: String
  }

  input IntegrationLinks {
    twitter: String
    facebook: String
    instagram:String
    youtube: String
  }

  input IntegrationExternalLinks {
    url: String
  }

  input IntegrationMessengerData {
    _id: ID
    notifyCustomer: Boolean
    botEndpointUrl: String
    skillData: JSON
    botShowInitialMessage: Boolean
    botCheck: Boolean
    botGreetMessage: String
    getStarted: Boolean
    persistentMenus: [BotPersistentMenuTypeMessenger]
    availabilityMethod: String
    isOnline: Boolean,
    onlineHours: [MessengerOnlineHoursSchema]
    timezone: String
    responseRate: String
    showTimezone: Boolean
    messages: JSON
    knowledgeBaseTopicId: String
    links: IntegrationLinks
    externalLinks: [IntegrationExternalLinks]
    supporterIds: [String]
    requireAuth: Boolean
    showChat: Boolean
    showLauncher: Boolean
    forceLogoutWhenResolve: Boolean
    showVideoCallRequest: Boolean
    hideWhenOffline: Boolean
  }

  input MessengerUiOptions {
    color: String
    wallpaper: String
    logo: String
    textColor: String
  }

  input OperatorInput {
    _id: ID
    userId: String
    name: String
  }

  input DepartmentInput {
    _id: ID
    name: String
    operators: [OperatorInput]
  }

  input IntegrationCallData {
    header: String
    description: String
    secondPageHeader: String
    secondPageDescription: String
    departments: [DepartmentInput]
    isReceiveWebCall: Boolean
  }
`;

export const queries = `
  integrations(
    ${cursorParams},
    page: Int,
    perPage: Int,
    kind: String,
    searchValue: String,
    channelId: String,
    brandId: String,
    tag: String,
    status: String,
    formLoadType: String,
    sortField: String
    sortDirection: Int
  ): IntegrationRespone

  allLeadIntegrations: [Integration]
  integrationsGetUsedTypes: [integrationsGetUsedTypes]
  integrationGetLineWebhookUrl(_id: ID!): String
  integrationDetail(_id: ID!): Integration
  integrationsTotalCount(kind: String, brandId: String, tag: String, channelId: String, status: String, formLoadType: String): integrationsTotalCount
`;

export const mutations = `
  integrationsCreateMessengerOnboarding(
    brandName: String!,
    languageCode: String
    color: String
    logo:String
  ): Integration


  integrationsEditMessengerOnboarding(
    _id: ID!,
    brandId: String!,
    brandName: String!,
    languageCode: String
    color: String
    logo:String
  ): Integration

  integrationsCreateMessengerIntegration(
    name: String!,
    brandId: String!,
    languageCode: String
    channelIds: [String]
    ): Integration

  integrationsEditMessengerIntegration(
    _id: ID!,
    name: String!,
    brandId: String!,
    languageCode: String
    channelIds: [String]
  ): Integration

  integrationsSaveMessengerAppearanceData(
    _id: ID!,
    uiOptions: MessengerUiOptions): Integration

  integrationsSaveMessengerConfigs(
    _id: ID!,
    messengerData: IntegrationMessengerData,
    callData: IntegrationCallData
    ): Integration

  integrationsCreateExternalIntegration(
    kind: String!,
    name: String!,
    brandId: String!,
    accountId: String,
    channelIds: [String]
    data: JSON): Integration

  integrationsEditCommonFields(_id: ID!, name: String!, brandId: String!, channelIds: [String], details: JSON): Integration

  integrationsRemove(_id: ID!): JSON
  integrationsRemoveAccount(_id: ID!, kind: String): JSON
  integrationsRepair(_id: ID!, kind: String!): JSON

  integrationsArchive(_id: ID!, status: Boolean!): Integration

  integrationsSendSms(integrationId: String!, content: String!, to: String!): JSON

  integrationsCreateLeadIntegration(
    name: String!,
    brandId: String!,
    channelIds: [String]
    ): Integration

  integrationsEditLeadIntegration(
    _id: ID!
    name: String!,
    brandId: String!,
    channelIds: [String]
  ): Integration
  integrationsCopyLeadIntegration(_id: ID!): Integration
`;
