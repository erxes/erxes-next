import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
     enum TokenPassMethod {
    cookie
    header
  }

  enum BusinessPortalKind {
    client
    vendor
  }

enum UserCardEnum {
    deal
    task
    ticket
    purchase
  }
    
  enum UserCardStatusEnum {
    participating
    invited
    left
    rejected
    won
    lost
    completed
  }

  enum UserCardPaymentEnum {
    paid
    unpaid
  }

  type ClientPortalParticipant {
    _id: String!
    contentType: UserCardEnum
    contentTypeId: String
    cpUserId: String
    cpUser: ClientPortalUser
    status: UserCardStatusEnum
    paymentStatus: UserCardPaymentEnum
    paymentAmount: Float
    offeredAmount: Float
    hasVat: Boolean
    createdAt: Date
    modifiedAt: Date
  }

  type OTPConfig {
    content: String
    codeLength: Int
    smsTransporterType: String
    loginWithOTP: Boolean
    expireAfter: Int
    emailSubject: String
  }

  type TwoFactorConfig {
    content: String
    codeLength: Int
    smsTransporterType: String
    enableTwoFactor: Boolean
    expireAfter: Int
    emailSubject: String
  }
  type MailConfig {
    subject: String
    invitationContent : String
    registrationContent : String
  }

  type ManualVerificationConfig {
    userIds: [String]
    verifyCustomer: Boolean
    verifyCompany: Boolean
  }

  type PasswordVerificationConfig {
    verifyByOTP: Boolean
    emailSubject: String
    emailContent: String
    smsContent: String
  }



  type SocialpayConfig {
    publicKey: String
    certId: String
  }

  type TokiConfig {
    merchantId: String
    apiKey: String
    username: String
    password: String
  }


  type EnvironmentVariable {
    key: String
    value: String
  }


type ClientPortal {
    _id: String!
    name: String!
    slug: String
    kind: BusinessPortalKind!
    description: String
    url: String
    logo: String
    icon: String
    headerHtml: String
    footerHtml: String

    domain: String
    dnsStatus: String
    messengerBrandCode: String
    knowledgeBaseLabel: String
    knowledgeBaseTopicId: String
    ticketLabel: String
    dealLabel: String
    purchaseLabel: String
    taskPublicBoardId: String
    taskPublicPipelineId: String
    taskPublicLabel: String
    taskLabel: String
    taskStageId: String
    taskPipelineId: String
    taskBoardId: String
    ticketStageId: String
    ticketPipelineId: String
    ticketBoardId: String
    dealStageId: String
    dealPipelineId: String
    dealBoardId: String
    purchaseStageId: String
    purchasePipelineId: String
    purchaseBoardId: String
    googleCredentials: JSON
    googleClientId: String
    googleClientSecret: String
    googleRedirectUri: String
    facebookAppId: String
    erxesAppToken: String
    styles: Styles
    mobileResponsive: Boolean
  
    otpConfig: OTPConfig
    twoFactorConfig: TwoFactorConfig

    mailConfig: MailConfig
    manualVerificationConfig: ManualVerificationConfig
    passwordVerificationConfig: PasswordVerificationConfig

    kbToggle: Boolean,
    publicTaskToggle: Boolean,
    ticketToggle: Boolean,
    taskToggle: Boolean,
    dealToggle: Boolean,
    purchaseToggle: Boolean,

    tokenExpiration: Int
    refreshTokenExpiration: Int
    tokenPassMethod: TokenPassMethod
    vendorParentProductCategoryId: String

    testUserEmail: String
    testUserPhone: String
    testUserPassword: String
    testUserOTP: String

    socialpayConfig: SocialpayConfig
    tokiConfig: TokiConfig
    language: String

    template: String
    templateId: String
    keywords: String
    copyright: String
    externalLinks: JSON
    googleAnalytics: String
    facebookPixel: String
    googleTagManager: String

    createdAt: Date
    environmentVariables: [EnvironmentVariable]
  }

  type Styles {
    bodyColor: String
    headerColor: String
    footerColor: String
    helpColor: String
    backgroundColor: String
    activeTabColor: String
    baseColor: String
    headingColor: String
    linkColor: String
    linkHoverColor: String
    baseFont: String
    headingFont: String
    dividerColor: String
    primaryBtnColor: String
    secondaryBtnColor: String
  }

  type ClientPortalListResponse {
    list: [ClientPortal]
    pageInfo: PageInfo
    totalCount: Int
  }



`;

export const inputs = `
input OTPConfigInput {
    content: String
    codeLength: Int
    smsTransporterType: String
    loginWithOTP: Boolean
    expireAfter: Int
    emailSubject: String
  }

  input TwoFactorConfigInput {
    content: String
    codeLength: Int
    smsTransporterType: String
    enableTwoFactor: Boolean
    expireAfter: Int
    emailSubject: String
  }


  input MailConfigInput {
    subject: String
    invitationContent : String
    registrationContent : String
  }

  input StylesParams {
    bodyColor: String
    headerColor: String
    footerColor: String
    helpColor: String
    backgroundColor: String
    activeTabColor: String
    baseColor: String
    headingColor: String
    linkColor: String
    linkHoverColor: String
    dividerColor: String
    primaryBtnColor: String
    secondaryBtnColor: String
    baseFont: String
    headingFont: String
  }

  input ItemDate {
    month: Int
    year: Int
  }

  input EnvironmentVariableInput {
    key: String
    value: String
  }

  input ClientPortalConfigInput {
    _id: String
    name: String!
    slug: String
    kind: BusinessPortalKind!
    description: String
    url: String
    logo: String
    icon: String
    headerHtml: String
    footerHtml: String

    domain: String
    dnsStatus: String
    messengerBrandCode: String
    kbToggle: Boolean,
    knowledgeBaseLabel: String
    knowledgeBaseTopicId: String
    ticketLabel: String
    dealLabel: String
    purchaseLabel: String

    taskToggle: Boolean,
    publicTaskToggle: Boolean,
    taskPublicBoardId: String
    taskPublicPipelineId: String
    taskPublicLabel: String
    taskLabel: String
    taskStageId: String
    taskPipelineId: String
    taskBoardId: String
    ticketToggle: Boolean,
    ticketStageId: String
    ticketPipelineId: String
    ticketBoardId: String
    dealToggle: Boolean,
    dealStageId: String
    dealPipelineId: String
    dealBoardId: String
    purchaseToggle: Boolean,
    purchaseStageId: String
    purchasePipelineId: String
    purchaseBoardId: String
    googleCredentials: JSON
    googleClientId: String
    googleClientSecret: String
    googleRedirectUri: String
    facebookAppId: String
    erxesAppToken: String
    styles: StylesParams
    mobileResponsive: Boolean

    testUserEmail: String
    testUserPhone: String
    testUserPassword: String
    testUserOTP: String

    otpConfig: OTPConfigInput
    twoFactorConfig:TwoFactorConfigInput
    mailConfig: MailConfigInput
    manualVerificationConfig: JSON
    passwordVerificationConfig: JSON
    tokenPassMethod: TokenPassMethod
    tokenExpiration: Int
    refreshTokenExpiration: Int
    vendorParentProductCategoryId: String
    socialpayConfig: JSON
    tokiConfig: JSON
    language: String

    template: String
    templateId: String
    keywords: String
    copyright: String
    externalLinks: JSON
    googleAnalytics: String
    facebookPixel: String
    googleTagManager: String
    environmentVariables: [EnvironmentVariableInput]
  }


`;

export const queries = `
  clientPortalGetConfigs(kind:BusinessPortalKind, search: String, ${GQL_CURSOR_PARAM_DEFS}): ClientPortalListResponse
  clientPortalGetConfig(_id: String!): ClientPortal
  clientPortalGetConfigByDomain(clientPortalName: String): ClientPortal
  clientPortalGetLast(kind: BusinessPortalKind): ClientPortal
  clientPortalConfigsTotalCount: Int
  clientPortalGetAllowedFields(_id: String!): JSON


  clientPortalParticipantDetail(_id: String, contentType:String, contentTypeId:String, cpUserId:String): ClientPortalParticipant
  clientPortalParticipants(contentType: String!, contentTypeId: String!, userKind: BusinessPortalKind): [ClientPortalParticipant]
  clientPortalCardUsers(contentType: String!, contentTypeId: String!, userKind: BusinessPortalKind): [ClientPortalUser]


   clientPortalKnowledgeBaseTopicDetail(_id: String!): KnowledgeBaseTopic
   clientPortalKnowledgeBaseArticles(searchValue: String, categoryIds: [String], topicId: String, isPrivate: Boolean, ${GQL_CURSOR_PARAM_DEFS}): KnowledgeBaseArticlesListResponse
`;

export const mutations = `
  clientPortalConfigUpdate (
    config: ClientPortalConfigInput!
  ): ClientPortal

  clientPortalRemove (_id: String!): JSON
  clientPortalCreateCard(
        type: String!
        stageId: String!
        subject: String!
        description: String
        priority: String,
        parentId: String,
        closeDate: Date
        startDate: Date
        attachments: [AttachmentInput]
        customFieldsData: JSON
        labelIds: [String]
        productsData: JSON
  ): JSON
  clientPortalParticipantRelationEdit(
        type: String!
        cardId: String!
        oldCpUserIds: [String]
        cpUserIds: [String]
      ): JSON
      clientPortalCommentsAdd(type: String!, typeId: String!, content: String! userType: String!): ClientPortalComment
      clientPortalCommentsRemove(_id: String!): String
      clientPortalParticipantEdit(_id: String!,
        contentType: UserCardEnum,
        contentTypeId: String,
        cpUserId: String,
        status: UserCardStatusEnum,
        paymentStatus: UserCardPaymentEnum,
        paymentAmount: Float,
        offeredAmount: Float,
        hasVat: Boolean):ClientPortalParticipant
`;
