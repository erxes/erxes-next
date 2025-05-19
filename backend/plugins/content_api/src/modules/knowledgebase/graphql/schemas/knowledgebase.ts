export const types = `
  type FormCode {
    brandId: String
    formId: String
  }

type KnowledgeBaseArticle @key(fields: "_id") {
    _id: String!
    code: String
    title: String
    summary: String
    content: String
    status: String
    isPrivate: Boolean
    reactionChoices: [String]
    reactionCounts: JSON
    createdBy: String
    createdUser: User
    createdDate: Date
    modifiedBy: String
    modifiedDate: Date
    topicId: String
    categoryId: String
    viewCount: Int
    attachments: [Attachment]
    image: Attachment
    pdfAttachment: PdfAttachment
    publishedUserId:String
    publishedUser:User
    publishedAt: Date
    scheduledDate: Date

    forms: [FormCode]
  }


type KnowledgeBaseCategory {
    _id: String
    code: String
    title: String
    description: String
    articles(status: String): [KnowledgeBaseArticle]
    icon: String
    createdBy: String
    createdDate: Date
    modifiedBy: String
    modifiedDate: Date
    parentCategoryId: String

    firstTopic: KnowledgeBaseTopic
    authors: [User]
    numOfArticles(status: String): Float
    countArticles:Int
  }

type KnowledgeBaseParentCategory {
    _id: String
    code: String
    title: String
    description: String
    articles: [KnowledgeBaseArticle]
    icon: String
    createdBy: String
    createdDate: Date
    modifiedBy: String
    modifiedDate: Date
    parentCategoryId: String

    firstTopic: KnowledgeBaseTopic
    authors: [User]
    numOfArticles(status: String): Float

    childrens: [KnowledgeBaseCategory]
  }

type KnowledgeBaseTopic @key(fields: "_id") {
    _id: String!
    code: String
    title: String
    description: String
    categories: [KnowledgeBaseCategory]
    brand: Brand
    color: String
    backgroundImage: String
    languageCode: String
    createdBy: String
    createdDate: Date
    modifiedBy: String
    modifiedDate: Date
    parentCategories: [KnowledgeBaseParentCategory]
    notificationSegmentId: String
  }

type KnowledgeBaseLoader {
    loadType: String
  }
`;

export const inputs = `
  input FormCodeInput {
    brandId: String
    formId: String
  }

input KnowledgeBaseArticleDoc {
    code: String
    title: String!
    summary: String
    content: String!
    status: String!
    isPrivate: Boolean
    reactionChoices: [String]
    categoryIds: [String]
    topicId: String
    categoryId: String
    image: AttachmentInput
    attachments: [AttachmentInput]
    pdfAttachment: PdfAttachmentInput
    scheduledDate: Date
    forms: [FormCodeInput]
  }
`;
