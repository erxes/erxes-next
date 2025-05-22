import { checkPermission } from 'erxes-api-shared/core-modules';
import { ITopic } from '@/knowledgebase/@types/knowledgebase';
import { IContext } from '~/connectionResolvers';
import {
  IArticleCreate,
  ICategoryCreate,
} from '~/modules/knowledgebase/db/models/Knowledgebase';

const knowledgeBaseMutations = {
  /**
   * Creates a topic document
   */
  async knowledgeBaseTopicsAdd(
    _root,
    { doc }: { doc: ITopic },
    { user, models }: IContext
  ) {
    const topic = await models.KnowledgeBaseTopics.createDoc(doc, user._id);

    // TODO: implement logs
    // await putCreateLog(
    //   models,
    //
    //   {
    //     type: MODULE_NAMES.KB_TOPIC,
    //     newData: {
    //       ...doc,
    //       createdBy: user._id,
    //       createdDate: topic.createdDate
    //     },
    //     object: topic
    //   },
    //   user
    // );

    return topic;
  },

  /**
   * Updates a topic document
   */
  async knowledgeBaseTopicsEdit(
    _root,
    { _id, doc }: { _id: string; doc: ITopic },
    { user, models }: IContext
  ) {
    const topic = await models.KnowledgeBaseTopics.getTopic(_id);
    const updated = await models.KnowledgeBaseTopics.updateDoc(
      _id,
      doc,
      user._id
    );

    // TODO: implement logs
    // await putUpdateLog(
    //   models,
    //
    //   {
    //     type: MODULE_NAMES.KB_TOPIC,
    //     object: topic,
    //     newData: {
    //       ...doc,
    //       modifiedBy: user._id,
    //       modifiedDate: updated.modifiedDate,
    //     },
    //     updatedDocument: updated,
    //   },
    //   user,
    // );

    return updated;
  },

  /**
   * Remove topic document
   */
  async knowledgeBaseTopicsRemove(
    _root,
    { _id }: { _id: string },
    { user, models }: IContext
  ) {
    const topic = await models.KnowledgeBaseTopics.getTopic(_id);
    const removed = await models.KnowledgeBaseTopics.removeDoc(_id);

    // TODO: implement logs
    // await putDeleteLog(
    //   models,
    //
    //   { type: MODULE_NAMES.KB_TOPIC, object: topic },
    //   user,
    // );

    return removed;
  },

  /**
   * Create category document
   */
  async knowledgeBaseCategoriesAdd(
    _root,
    { doc }: { doc: ICategoryCreate },
    { user, models }: IContext
  ) {
    const kbCategory = await models.KnowledgeBaseCategories.createDoc(
      doc,
      user._id
    );

    // await putCreateLog(
    //   models,
    //
    //   {
    //     type: MODULE_NAMES.KB_CATEGORY,
    //     newData: {
    //       ...doc,
    //       createdBy: user._id,
    //       createdDate: kbCategory.createdDate,
    //     },
    //     object: kbCategory,
    //   },
    //   user,
    // );

    return kbCategory;
  },

  /**
   * Update category document
   */
  async knowledgeBaseCategoriesEdit(
    _root,
    { _id, doc }: { _id: string; doc: ICategoryCreate },
    { user, models }: IContext
  ) {
    const kbCategory = await models.KnowledgeBaseCategories.getCategory(_id);
    const updated = await models.KnowledgeBaseCategories.updateDoc(
      _id,
      doc,
      user._id
    );

    // TODO: implement logs
    // await putUpdateLog(
    //   models,

    //   {
    //     type: MODULE_NAMES.KB_CATEGORY,
    //     object: kbCategory,
    //     newData: {
    //       ...doc,
    //       modifiedBy: user._id,
    //       modifiedDate: updated.modifiedDate,
    //     },
    //     updatedDocument: updated,
    //   },
    //   user,
    // );

    return updated;
  },

  /**
   * Remove category document
   */
  async knowledgeBaseCategoriesRemove(
    _root,
    { _id }: { _id: string },
    { user, models }: IContext
  ) {
    const kbCategory = await models.KnowledgeBaseCategories.getCategory(_id);

    await models.KnowledgeBaseCategories.updateMany(
      { parentCategoryId: { $in: [kbCategory._id] } },
      { $unset: { parentCategoryId: 1 } }
    );

    const removed = await models.KnowledgeBaseCategories.removeDoc(_id);

    // TODO: implement logs
    // await putDeleteLog(
    //   models,

    //   { type: MODULE_NAMES.KB_CATEGORY, object: kbCategory },
    //   user,
    // );

    return removed;
  },

  /**
   * Create article document
   */
  async knowledgeBaseArticlesAdd(
    _root,
    { doc }: { doc: IArticleCreate },
    { user, models }: IContext
  ) {
    if (doc.status === 'scheduled' && !doc.scheduledDate) {
      throw new Error('Scheduled Date must be supplied');
    }

    if (
      doc.status === 'scheduled' &&
      doc.scheduledDate &&
      doc.scheduledDate < new Date()
    ) {
      throw new Error('Scheduled Date can not be in the past !');
    }

    const kbArticle = await models.KnowledgeBaseArticles.createDoc(
      doc,
      user._id
    );

    // TODO: implement logs
    // await putCreateLog(
    //   models,

    //   {
    //     type: MODULE_NAMES.KB_ARTICLE,
    //     newData: {
    //       ...doc,
    //       createdBy: user._id,
    //       createdDate: kbArticle.createdDate,
    //     },
    //     object: kbArticle,
    //   },
    //   user,
    // );

    // TODO: implement history
    // await sendCoreMessage({
    //   action: 'registerOnboardHistory',
    //   data: {
    //     type: 'knowledgeBaseArticleCreate',
    //     user,
    //   },
    // });

    const topic = await models.KnowledgeBaseTopics.findOne({
      _id: kbArticle.topicId,
    });

    // TODO: implement notifications
    // if (topic && topic.notificationSegmentId) {
    //   const userIds = await sendCoreMessage({
    //     action: 'fetchSegment',
    //     data: {
    //       segmentId: topic.notificationSegmentId,
    //     },
    //     isRPC: true,
    //   });

    //   sendCoreMessage({
    //     action: 'sendMobileNotification',
    //     data: {
    //       title: doc.title,
    //       body: stripHtml(doc.content),
    //       receivers: userIds.filter((userId) => userId !== user._id),
    //       data: {
    //         type: 'knowledge',
    //         id: kbArticle._id,
    //       },
    //     },
    //   });
    // }

    return kbArticle;
  },

  /**
   * Update article document
   */
  async knowledgeBaseArticlesEdit(
    _root,
    { _id, doc }: { _id: string; doc: IArticleCreate },
    { user, models }: IContext
  ) {
    const kbArticle = await models.KnowledgeBaseArticles.getArticle(_id);

    if (doc.status === 'scheduled' && !doc.scheduledDate) {
      throw new Error('Scheduled Date must be supplied');
    }

    if (
      doc.status === 'scheduled' &&
      doc.scheduledDate &&
      doc.scheduledDate < new Date()
    ) {
      throw new Error('Scheduled Date can not be in the past !');
    }

    const updated = await models.KnowledgeBaseArticles.updateDoc(
      _id,
      doc,
      user._id
    );

    // TODO: implement logs
    // await putUpdateLog(
    //   models,

    //   {
    //     type: MODULE_NAMES.KB_ARTICLE,
    //     object: kbArticle,
    //     newData: {
    //       ...doc,
    //       modifiedBy: user._id,
    //       modifiedDate: updated.modifiedDate,
    //     },
    //     updatedDocument: updated,
    //   },
    //   user,
    // );

    return updated;
  },

  /**
   * Remove article document
   */
  async knowledgeBaseArticlesRemove(
    _root,
    { _id }: { _id: string },
    { user, models }: IContext
  ) {
    const kbArticle = await models.KnowledgeBaseArticles.getArticle(_id);
    const removed = await models.KnowledgeBaseArticles.removeDoc(_id);

    // TODO: implement logs
    // await putDeleteLog(
    //   models,

    //   { type: MODULE_NAMES.KB_ARTICLE, object: kbArticle },
    //   user,
    // );

    return removed;
  },

  async knowledgeBaseArticlesIncrementViewCount(
    _root,
    { _id }: { _id: string },
    { models }: IContext
  ) {
    return await models.KnowledgeBaseArticles.incrementViewCount(_id);
  },
};

checkPermission(
  knowledgeBaseMutations,
  'knowledgeBaseTopicsAdd',
  'manageKnowledgeBase'
);
checkPermission(
  knowledgeBaseMutations,
  'knowledgeBaseTopicsEdit',
  'manageKnowledgeBase'
);
checkPermission(
  knowledgeBaseMutations,
  'knowledgeBaseTopicsRemove',
  'manageKnowledgeBase'
);

checkPermission(
  knowledgeBaseMutations,
  'knowledgeBaseCategoriesAdd',
  'manageKnowledgeBase'
);
checkPermission(
  knowledgeBaseMutations,
  'knowledgeBaseCategoriesEdit',
  'manageKnowledgeBase'
);
checkPermission(
  knowledgeBaseMutations,
  'knowledgeBaseCategoriesRemove',
  'manageKnowledgeBase'
);

checkPermission(
  knowledgeBaseMutations,
  'knowledgeBaseArticlesAdd',
  'manageKnowledgeBase'
);
checkPermission(
  knowledgeBaseMutations,
  'knowledgeBaseArticlesEdit',
  'manageKnowledgeBase'
);
checkPermission(
  knowledgeBaseMutations,
  'knowledgeBaseArticlesRemove',
  'manageKnowledgeBase'
);

export default knowledgeBaseMutations;
