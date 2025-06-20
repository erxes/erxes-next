import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

const typeDeps = `
  type TicketsTimeTrack {
    status: String,
    timeSpent: Int,
    startDate: String
  }
`;

const inputDeps = `
  input TicketsItemDate {
    month: Int
    year: Int
  }
`;

export const types = `
  ${typeDeps}
  ${inputDeps}

  type Ticket @key(fields: "_id") {
    _id: String!
    source: String
    companies: [Company]
    customers: [Customer]

    name: String!
    order: Float
    createdAt: Date
    hasNotified: Boolean
    assignedUserIds: [String]
    branchIds: [String]
    departmentIds:[String]
    labelIds: [String]
    startDate: Date
    closeDate: Date
    description: String
    modifiedAt: Date
    modifiedBy: String
    reminderMinute: Int,
    isComplete: Boolean,
    isWatched: Boolean,
    stageId: String
    boardId: String
    priority: String
    status: String
    attachments: [Attachment]
    userId: String
    tagIds: [String]

    assignedUsers: [User]
    stage: TicketsStage
    labels: [TicketsPipelineLabel]
    pipeline: TicketsPipeline
    createdUser: User
    customFieldsData: JSON
    score: Float
    timeTrack: TicketsTimeTrack
    number: String
    stageChangedDate: Date

    customProperties: JSON
    type: String

    tags: [Tag]

    cursor: String
  }

  type TicketsListResponse {
    list: [Ticket],
    pageInfo: PageInfo
    totalCount: Int,
  }
`;

const queryParams = `
  _ids: [String]
  pipelineId: String
  pipelineIds: [String]
  parentId:String
  stageId: String
  stage: [String]
  customerIds: [String]
  vendorCustomerIds: [String]
  companyIds: [String]
  date: TicketsItemDate
  skip: Int
  limit: Int
  search: String
  assignedUserIds: [String]
  closeDateType: String
  priority: [String]
  source: [String]
  labelIds: [String]
  userIds: [String]
  segment: String
  segmentData: String
  assignedToMe: String
  startDate: String
  endDate: String
  hasStartAndCloseDate: Boolean
  tagIds: [String]
  noSkipArchive: Boolean
  number: String
  branchIds: [String]
  departmentIds: [String]
  boardIds: [String]
  stageCodes: [String]
  dateRangeFilters:JSON
  customFieldsDataFilters:JSON
  createdStartDate: Date,
  createdEndDate: Date
  stateChangedStartDate: Date
  stateChangedEndDate: Date
  startDateStartDate: Date
  startDateEndDate: Date
  closeDateStartDate: Date
  closeDateEndDate: Date
  resolvedDayBetween:[Int]

  ${GQL_CURSOR_PARAM_DEFS}
`;

const archivedQueryParams = `
  pipelineId: String!
  search: String
  userIds: [String]
  priorities: [String]
  assignedUserIds: [String]
  labelIds: [String]
  companyIds: [String]
  customerIds: [String]
  startDate: String
  endDate: String
  sources: [String]
`;

export const queries = `
  ticketDetail(_id: String!): Ticket

  tickets(${queryParams}): TicketsListResponse
  ticketsTotalCount(${queryParams}): Int

  archivedTickets(${archivedQueryParams}): TicketsListResponse
  archivedTicketsCount(${archivedQueryParams}): Int
`;

const mutationParams = `
  source: String,
  type: String,
  parentId:String,
  proccessId: String,
  aboveItemId: String,
  stageId: String,
  assignedUserIds: [String],
  attachments: [AttachmentInput],
  startDate: Date,
  closeDate: Date,
  description: String,
  order: Int,
  reminderMinute: Int,
  isComplete: Boolean,
  priority: String,
  status: String,
  sourceConversationIds: [String],
  customFieldsData: JSON,
  tagIds: [String],
  branchIds: [String],
  departmentIds: [String],
`;

export const mutations = `
  ticketsAdd(name: String!, companyIds: [String], customerIds: [String], labelIds: [String], ${mutationParams}): Ticket
  ticketsEdit(_id: String!, name: String, ${mutationParams}): Ticket
  ticketsChange(itemId: String!, aboveItemId: String, destinationStageId: String!, sourceStageId: String, proccessId: String): Ticket
  ticketsRemove(_id: String!): Ticket

  ticketsWatch(_id: String, isAdd: Boolean): Ticket
  ticketsCopy(_id: String!, proccessId: String): Ticket
  ticketsArchive(stageId: String!, proccessId: String): String
`;
