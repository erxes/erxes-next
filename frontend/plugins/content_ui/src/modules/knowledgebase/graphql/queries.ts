import { gql } from '@apollo/client';
import { PAGE_INFO_FRAGMENT, ATTACHMENT_FRAGMENT } from 'erxes-ui';

export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    _id
    username
    email
    details {
      avatar
      fullName
    }
  }
`;

export const CATEGORY_FRAGMENT = gql`
  fragment CategoryFragment on KnowledgeBaseCategory {
    _id
    title
    code
    description
    icon
    numOfArticles
    authors {
      _id
      details {
        fullName
        avatar
      }
    }
  }
`;

export const PARENT_CATEGORY_FRAGMENT = gql`
  fragment ParentCategoryFragment on KnowledgeBaseParentCategory {
    _id
    code
    title
    description
    icon
    numOfArticles
    authors {
      _id
      details {
        fullName
        avatar
      }
    }
  }
`;

export const TOPICS_SHORT = gql`
  ${PAGE_INFO_FRAGMENT}
  query knowledgeBaseTopics($page: Int, $perPage: Int) {
    knowledgeBaseTopics(page: $page, perPage: $perPage) {
      list {
        _id
        title
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalCount
    }
  }
`;

export const TOPICS = gql`
  ${PAGE_INFO_FRAGMENT}
  ${CATEGORY_FRAGMENT}
  ${PARENT_CATEGORY_FRAGMENT}
  query knowledgeBaseTopics($page: Int, $perPage: Int) {
    knowledgeBaseTopics(page: $page, perPage: $perPage) {
      list {
        _id
        title
        code
        description

        categories {
          ...CategoryFragment
        }
        color
        backgroundImage
        languageCode
        createdBy
        createdDate
        modifiedBy
        notificationSegmentId
        parentCategories {
          ...ParentCategoryFragment
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalCount
    }
  }
`;

export const BRANDS = gql`
  query brands {
    brands {
      _id
      name
    }
  }
`;

export const SEGMENTS = gql`
  query segments($contentTypes: [String]!) {
    segments(contentTypes: $contentTypes) {
      _id
      name
    }
  }
`;

export const CATEGORIES = gql`
  ${CATEGORY_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
  query knowledgeBaseCategories(
    $page: Int
    $perPage: Int
    $topicIds: [String]
  ) {
    knowledgebaseCategories(
      page: $page
      perPage: $perPage
      topicIds: $topicIds
    ) {
      list {
        ...CategoryFragment
        createdBy
        createdDate
        modifiedBy
        modifiedDate
        parentCategoryId
        articles {
          _id
          title
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalCount
    }
  }
`;

export const CATEGORY_DETAIL = gql`
  ${CATEGORY_FRAGMENT}
  query knowledgeBaseCategory($_id: String!) {
    knowledgeBaseCategory(_id: $_id) {
      ...CategoryFragment
      articles {
        _id
        title
        summary
        content
        status
        isPrivate
      }
      firstTopic {
        _id
        title
      }
    }
  }
`;

export const CATEGORY_LAST = gql`
  query knowledgeBaseCategoriesGetLast {
    knowledgeBaseCategoriesGetLast {
      _id
      firstTopic {
        _id
        title
      }
    }
  }
`;

export const ARTICLES = gql`
  ${USER_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
  query knowledgeBaseArticles(
    $page: Int
    $perPage: Int
    $categoryIds: [String]
  ) {
    knowledgeBaseArticles(
      page: $page
      perPage: $perPage
      categoryIds: $categoryIds
    ) {
      list {
        _id
        title
        createdDate
        status
        createdUser {
          _id
          username
          email
        }
        publishedUser {
          ...UserFragment
        }
        createdBy
        modifiedBy
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalCount
    }
  }
`;

export const ARTICLE_DETAIL = gql`
  ${CATEGORY_FRAGMENT}
  ${USER_FRAGMENT}
  ${ATTACHMENT_FRAGMENT}

  query knowledgeBaseArticleDetail($_id: String!) {
    knowledgeBaseArticleDetail(_id: $_id) {
      _id
      code
      title
      summary
      content
      status
      isPrivate
      reactionChoices
      reactionCounts
      createdBy
      topicId
      categoryId
      createdUser {
        ...UserFragment
      }
      attachments {
        ...AttachmentFragment
      }

      pdfAttachment {
        pdf {
          ...AttachmentFragment
        }
        pages {
          ...AttachmentFragment
        }
      }
      image {
        ...AttachmentFragment
      }
      createdDate
      modifiedBy
      modifiedDate
      scheduledDate

      forms {
        brandId
        formId
      }

      publishedUserId
      publishedUser {
        ...UserFragment
      }
    }
  }
`;
