import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

const typeDefs = `
  type TasksTimeTrack {
    status: String,
    timeSpent: Int,
    startDate: String
  }
`;

const inputDeps = `
 input TasksItemDate {
    month: Int
    year: Int
  }
`;

export const types = `

  ${typeDefs}
  ${inputDeps}

  type Task @key(fields: "_id") {
    _id: String!
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
    stage: TasksStage
    labels: [TasksPipelineLabel]
    pipeline: TasksPipeline
    createdUser: User
    customFieldsData: JSON
    score: Float
    timeTrack: TasksTimeTrack
    number: String
    stageChangedDate: Date

    customProperties: JSON
    companies: [Company]
    customers: [Customer]
    tags: [Tag]

    cursor: String
  }

  type TasksListResponse {
    list: [Task]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

const queryParams = `
  _ids: [String]
  pipelineId: String
  pipelineIds: [String]
  parentId:String
  stageId: String
  customerIds: [String]
  companyIds: [String]
  date: TasksItemDate
  skip: Int
  limit: Int
  search: String
  assignedUserIds: [String]
  closeDateType: String
  priority: [String]
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

  ${GQL_CURSOR_PARAM_DEFS}
`;

export const queries = `
  tasks(${queryParams}): TasksListResponse
  tasksTotalCount(${queryParams}): Int
  taskDetail(_id: String!, clientPortalCard:Boolean): Task
  archivedTasks(${archivedQueryParams}): TasksListResponse
  archivedTasksCount(${archivedQueryParams}): Int
`;

const mutationParams = `
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
  tasksAdd(name: String!, companyIds: [String], customerIds: [String], labelIds: [String], ${mutationParams}): Task
  tasksEdit(_id: String!, name: String, ${mutationParams}): Task
  tasksChange(itemId: String!, aboveItemId: String, destinationStageId: String!, sourceStageId: String, proccessId: String): Task
  tasksRemove(_id: String!): Task
  tasksWatch(_id: String, isAdd: Boolean): Task
  tasksCopy(_id: String!, proccessId: String): Task
  tasksArchive(stageId: String!, proccessId: String): String
`;
