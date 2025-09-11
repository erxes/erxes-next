import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `




    
    enum PostStatus {
        draft
        published
        scheduled
        archived
    }

    enum PostAuthorKind {
        user
        clientPortalUser
    }

    union Author = User | ClientPortalUser

    type Post @key(fields: "_id") @cacheControl(maxAge: 3){
        _id: ID!
        type: String
        customPostType: CustomPostType
        authorKind: PostAuthorKind
        authorId: String
        author: Author
        clientPortalId: String!
        title: String
        slug: String
        content: String
        excerpt: String
        categoryIds: [String]
        status: PostStatus
        tagIds: [String]
  
        featured: Boolean
        featuredDate: Date
        scheduledDate: Date
        autoArchiveDate: Date
        reactions: [String]
        reactionCounts: JSON
        thumbnail: Attachment
        images: [Attachment]
        video: Attachment
        audio: Attachment
        documents: [Attachment]
        attachments: [Attachment]
        pdfAttachment: PdfAttachment
        videoUrl: String
        createdAt: Date
        updatedAt: Date

        
        categories: [PostCategory]
        tags: [PostTag]
        customFieldsData: JSON

        customFieldsMap: JSON
    }

    type PostList {
        posts: [Post]
        totalCount: Int
        pageInfo: PageInfo
    }

    type PostTranslation {
        _id: ID!
        postId: String
        language: String
        title: String
        content: String
        excerpt: String
        customFieldsData: JSON
    }
`;

export const inputs = `
    input PostInput {
        clientPortalId: String
        title: String
        slug: String
        content: String
        excerpt: String
        categoryIds: [String]
        featured: Boolean
        status: PostStatus
        tagIds: [String]
        authorId: String
        scheduledDate: Date
        autoArchiveDate: Date
        reactions: [String]
        reactionCounts: JSON
        thumbnail: AttachmentInput
        images: [AttachmentInput]
        video: AttachmentInput
        audio: AttachmentInput
        documents: [AttachmentInput]
        attachments: [AttachmentInput]
        pdfAttachment: PdfAttachmentInput
        videoUrl: String
        customFieldsData: JSON
        type: String
    }

    input PostTranslationInput {
        postId: String
        language: String
        title: String
        content: String
        excerpt: String
        customFieldsData: JSON
    }
`;

export const queries = `
    cmsPost(_id: ID, slug: String, language: String): Post
    cmsPosts(clientPortalId: String, featured: Boolean,type: String, categoryId: String, searchValue: String, status: PostStatus, tagIds: [String], sortField: String, sortDirection: String, language: String, language: String, ${GQL_CURSOR_PARAM_DEFS}): [Post]
    cmsPostList(clientPortalId: String, featured: Boolean, type: String, categoryId: String, searchValue: String, status: PostStatus, tagIds: [String], sortField: String, sortDirection: String, language: String, language: String, ${GQL_CURSOR_PARAM_DEFS}): PostList
    cmsPostTranslations(postId: String): [PostTranslation]
`;

export const mutations = `
    cmsPostsAdd(input: PostInput!): Post
    cmsPostsAddTranslation(input: PostTranslationInput!): PostTranslation
    cmsPostsEdit(_id: ID!, input: PostInput!): Post
    cmsPostsEditTranslation(input: PostTranslationInput!): PostTranslation
    cmsPostsRemove(_id: ID!): JSON
    cmsPostsChangeStatus(_id: ID!, status: PostStatus!): Post
    cmsPostsToggleFeatured(_id: ID!): Post

    cmsPostsIncrementViewCount(_id: ID!): Post
`;
