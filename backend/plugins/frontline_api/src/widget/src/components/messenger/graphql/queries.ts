import { gql } from '@apollo/client';
import { MESSAGE_FIELDS, messageFields } from './fields';

const GET_UNREAD_COUNT = gql`
  query widgetsUnreadCount($conversationId: String) {
    widgetsUnreadCount(conversationId: $conversationId)
  }
`;

const GET_CONVERSATION_DETAIL = gql`
  query ($_id: String, $integrationId: String!) {
    widgetsConversationDetail(_id: $_id, integrationId: $integrationId) {
      _id
      messages {
        _id
        conversationId
        customerId
        user {
          _id
          details {
            avatar
            fullName
          }
        }
        content
        createdAt
        fromBot
        contentType
        internal
      }
      operatorStatus
      isOnline
      supporters {
        _id
        details {
          avatar
          fullName
        }
      }
      participatedUsers {
        _id
        details {
          avatar
          fullName
          shortName
        }
        links
      }
    }
  }
`;

const GET_WIDGET_EXPORT_MESSENGER_DATA = gql`
  query widgetExportMessengerData($_id: String, $integrationId: String!) {
    widgetExportMessengerData(_id: $_id, integrationId: $integrationId)
  }
`;

const GET_FAQ_TOPIC = gql`
  query knowledgeBaseTopicDetail($_id: String!) {
    knowledgeBaseTopicDetail(_id: $_id) {
      parentCategories {
        _id
        title
      }
    }
  }
`;

const GET_CLOUDFLARE_CALL_INTEGRATION = gql`
  query CloudflareCallsGetIntegrations {
    cloudflareCallsGetIntegrations {
      _id
      erxesApiId
      name
    }
  }
`;

const TICKET_COMMENTS = gql`
  query widgetsTicketComments($typeId: String!, $type: String!) {
    widgetsTicketComments(typeId: $typeId, type: $type) {
      _id
      content
      createdUser {
        _id
        email
        emails
        phone
        phones
        lastName
        firstName
        avatar
      }
      type
      userType
      createdAt
    }
  }
`;

const TICKET_ACTIVITY_LOGS = gql`
  query widgetsTicketActivityLogs($contentType: String!, $contentId: String) {
    widgetsTicketActivityLogs(
      contentType: $contentType
      contentId: $contentId
    ) {
      _id
      action
      contentType
      createdByDetail
      content
      createdAt
    }
  }
`;

const userDetailFields = `
  avatar
  fullName
`;

const userFields = `
  _id
  isActive
  details {
    ${userDetailFields}
    description
    location
    position
    shortName
  }
  isOnline
`;

const conversationDetailQuery = (isDailycoEnabled: boolean) => `
  query ($_id: String, $integrationId: String!) {
    widgetsConversationDetail(_id: $_id, integrationId: $integrationId) {
      _id
      messages {
        ${messageFields}
        ${
          isDailycoEnabled
            ? `
        videoCallData {
          url
          status
        }`
            : ''
        }
      }

      operatorStatus
      isOnline
      persistentMenus
      fromBot
      botData
      botGreetMessage
      getStarted
      supporters {
        _id
        details {
          ${userDetailFields}
          description
          location
          position
          shortName
        }
      }
      participatedUsers {
        _id
        details {
          ${userDetailFields}
          description
          location
          position
          shortName
        }
        links
      }
    }
  }
`;

const widgetExportMessengerDataQuery = `
  query widgetExportMessengerData($_id: String, $integrationId: String!) {
    widgetExportMessengerData(_id: $_id, integrationId:$integrationId)
  }
`;

const unreadCountQuery = `
  query widgetsUnreadCount($conversationId: String) {
    widgetsUnreadCount(conversationId: $conversationId)
  }
`;

const messengerSupportersQuery = gql`
  query widgetsMessengerSupporters($integrationId: String!) {
    widgetsMessengerSupporters(integrationId: $integrationId) {
      supporters {
        ${userFields}
      }
      isOnline
    }
  }
`;

const totalUnreadCountQuery = `
  query widgetsTotalUnreadCount($integrationId: String!, $customerId: String, $visitorId: String) {
    widgetsTotalUnreadCount(integrationId: $integrationId, customerId: $customerId, visitorId: $visitorId)
  }
`;

const GET_WIDGETS_CONVERSATIONS = gql`
  query widgetsConversations($integrationId: String!, $customerId: String, $visitorId: String) {
    widgetsConversations(integrationId: $integrationId, customerId: $customerId, visitorId: $visitorId) {
      _id
      content
      createdAt
      idleTime
      participatedUsers {
        _id
        details {
          ${userDetailFields}
          description
          location
          position
          shortName
        }
      }
      messages {
        _id
        createdAt
        content
        fromBot
        customerId
        isCustomerRead
        userId
        user {
          _id
          isOnline
          details {
            avatar
            fullName
          }
        }
      }
    }
  }
`;

const getEngageMessage = `
  query widgetsGetEngageMessage($integrationId: String $customerId: String $visitorId: String $browserInfo: JSON!) {
    widgetsGetEngageMessage(integrationId: $integrationId customerId: $customerId visitorId: $visitorId browserInfo: $browserInfo) {
      ${messageFields}
    }
  }
`;

const customerDetail = `
  query WidgetsTicketCustomerDetail($customerId: String) {
    widgetsTicketCustomerDetail(customerId: $customerId) {
      _id
      emails
      email
      phone
      phones
      lastName
      firstName
      visitorContactInfo
    }
  }
`;

// faq

const faqFields = `
  _id
  title
  summary
  content
  createdDate
`;

const categoryFields = `
  _id
  title
  description
  numOfArticles(status: "publish")
  parentCategoryId
  icon
`;

const getFaqCategoryQuery = `
  query knowledgeBaseCategoryDetail($_id: String!) {
    knowledgeBaseCategoryDetail(_id: $_id) {
      ${categoryFields}
      parentCategoryId
      articles(status: "publish") {
        ${faqFields}
      }
    }
  }
`;

const getFaqTopicQuery = `
  query knowledgeBaseTopicDetail($_id: String!) {
    knowledgeBaseTopicDetail(_id: $_id) {
      title
      description
      categories {
        ${categoryFields}
      }
      parentCategories {
        ${categoryFields}
      }
    }
  }
`;

const faqSearchArticlesQuery = `
  query widgetsKnowledgeBaseArticles($topicId: String!, $searchString: String!) {
    widgetsKnowledgeBaseArticles(topicId: $topicId, searchString: $searchString) {
      ${faqFields}
    }
  }
`;

const integrationsFetchApi = `
  query integrationsFetchApi($path: String!, $params: JSON!) {
    integrationsFetchApi(path: $path, params: $params)
  }
`;

const GET_SUPPORTERS = gql`
  query Users($ids: [String]) {
    users(ids: $ids) {
      totalCount
      list {
        _id
        isActive
        isOnline
        email
        details {
          avatar
          firstName
          lastName
          description
          location
          position
          shortName
        }
      }
    }
  }
`;

const GET_USER_DETAIL = gql`
  query UserDetail($_id: String) {
    userDetail(_id: $_id) {
      _id
      isActive
      isOnline
      email
      details {
        avatar
        firstName
        lastName
        description
        location
        position
        shortName
      }
    }
  }
`;
export {
  GET_UNREAD_COUNT,
  GET_CONVERSATION_DETAIL,
  GET_WIDGET_EXPORT_MESSENGER_DATA,
  GET_FAQ_TOPIC,
  GET_CLOUDFLARE_CALL_INTEGRATION,
  TICKET_COMMENTS,
  TICKET_ACTIVITY_LOGS,
  conversationDetailQuery,
  widgetExportMessengerDataQuery,
  unreadCountQuery,
  totalUnreadCountQuery,
  GET_WIDGETS_CONVERSATIONS,
  messengerSupportersQuery,
  getFaqCategoryQuery,
  getFaqTopicQuery,
  faqSearchArticlesQuery,
  integrationsFetchApi,
  getEngageMessage,
  customerDetail,
  MESSAGE_FIELDS,
  GET_SUPPORTERS,
  GET_USER_DETAIL,
};
