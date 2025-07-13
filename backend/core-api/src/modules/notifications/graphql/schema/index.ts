import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `

type NotificationModuleType {
    name:String,
    text:String
}

type NotificationModule {
    name:String,
    description:String,
    icon:String,
    types:[NotificationModuleType]
}

type NotificationPluginType {
    pluginName:String,
    modules:[NotificationModule]
}

type NotificationConfig {
    _id: String!
    contentType: String!
    action: String!
    enabled: Boolean!
    inAppEnabled: Boolean!
    emailEnabled: Boolean!
    emailTemplateId: String
    emailSubject: String
    expiresAfterDays: Int
    createdAt: Date
    updatedAt: Date
    createdBy: String!
}

type NotificationConfigListResponse {
    list: [NotificationConfig]
    totalCount: Int
}

type Notification {
    _id: String,
    title: String,
    message: String,
    type: String,
    fromUserId: String,
    fromUser:User,
    contentType: String,
    contentTypeId: String,
    priority: String,
    metadata: JSON,
    createdAt: Date,
    isRead: Boolean
}

type NotificationsList {
    list:[Notification]
    totalCount: Int
    pageInfo: PageInfo
}

enum NotificationPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum NotificationStatus {
    READ
    UNREAD
    ALL
}

enum NotificationType {
    INFO
    SUCCESS
    WARNING
    ERROR
}
`;

const NOTIFICATIONS_QUERIES_PARAMS = `
    status:NotificationStatus,
    priority:NotificationPriority,
    type:NotificationType,
    fromDate:String,
    endDate:String,
    module:String,
    fromUserId:String
`;

export const queries = `
    pluginsNotifications:[NotificationPluginType]
    notifications(${GQL_CURSOR_PARAM_DEFS},${NOTIFICATIONS_QUERIES_PARAMS}):NotificationsList
    notificationDetail(_id:String!):Notification
    unreadNotificationsCount:Int
    userNotificationSettings: JSON
    organizationNotificationConfigs: JSON
    organizationNotificationConfig(contentType: String!, action: String!): JSON
`;

export const mutations = `
    editUserNotificationSettings(userSettings:JSON): JSON
    editOrganizationNotificationConfigs(configs: JSON!): JSON
`;

export default { queries, mutations, types };
