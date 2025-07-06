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

type NotificationType {
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
    contentType: String,
    contentTypeId: String,
    priority: String,
    metadata: JSON,
    createdAt: Date,
    isRead: Boolean
}
`;

export const queries = `
    pluginsNotifications:[NotificationType]
    notifications:[Notification]
    notification(_id:String!):Notification
    userNotificationSettings: JSON
    organizationNotificationConfigs: JSON
    organizationNotificationConfig(contentType: String!, action: String!): JSON
`;

export const mutations = `
    editUserNotificationSettings(userSettings:JSON): JSON
    editOrganizationNotificationConfigs(configs: JSON!): JSON
`;

export default { queries, mutations, types };
