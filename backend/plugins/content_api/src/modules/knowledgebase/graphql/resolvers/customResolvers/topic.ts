import { IContext } from '~/connectionResolvers';
import { ITopicDocument } from '@/knowledgebase/@types/knowledgebase';
import { sendTRPCMessage } from 'erxes-api-shared/src/utils';

export default {
  async __resolveReference({ _id }, { models }: IContext) {
    return models.KnowledgeBaseTopics.findOne({ _id });
  },

  brand(topic: ITopicDocument) {
    if (!topic.brandId) {
      return null;
    }

    return sendTRPCMessage({
      pluginName: 'core',
      module: 'brands',
      action: 'findOne',
      input: { query: { _id: topic.brandId } },
    });
  },

  async categories(topic: ITopicDocument, _args, { models }: IContext) {
    return models.KnowledgeBaseCategories.find({ topicId: topic._id }).sort({
      title: 1,
    });
  },

  async parentCategories(topic: ITopicDocument, _args, { models }: IContext) {
    return models.KnowledgeBaseCategories.find({
      topicId: topic._id,
      $or: [
        { parentCategoryId: null },
        { parentCategoryId: { $exists: false } },
        { parentCategoryId: '' },
      ],
    }).sort({
      title: 1,
    });
  },

  color(topic: ITopicDocument) {
    return topic.color || '';
  },
};
