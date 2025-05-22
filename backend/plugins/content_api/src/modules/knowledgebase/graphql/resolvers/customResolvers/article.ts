import { IContext } from '~/connectionResolvers';
import { IArticleDocument } from '@/knowledgebase/@types/knowledgebase';

export default {
  async __resolveReference({ _id }, { models }: IContext) {
    return models.KnowledgeBaseArticles.findOne({ _id });
  },

  createdUser(article: IArticleDocument) {
    return {
      __typename: 'User',
      _id: article.createdBy,
    };
  },
  publishedUser(article: IArticleDocument) {
    return article?.publishedUserId
      ? {
          __typename: 'User',
          _id: article?.publishedUserId,
        }
      : null;
  },
};
