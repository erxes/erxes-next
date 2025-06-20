import { graphqlPubsub, sendTRPCMessage } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { ITask } from '~/modules/tasks/@types/tasks';
import { TASK_STATUSES } from '~/modules/tasks/constants';
import {
  changeItemStatus,
  checkMovePermission,
  copyPipelineLabels,
  getNewOrder,
  itemResolver,
} from '~/modules/tasks/graphql/resolvers/utils';

export const taskMutations = {
  /**
   * Creates a new task
   */
  async tasksAdd(
    _root,
    doc: ITask & { proccessId: string; aboveItemId: string },
    { user, models }: IContext,
  ) {
    doc.initialStageId = doc.stageId;
    doc.watchedUserIds = user && [user._id];

    const extendedDoc = {
      ...doc,
      modifiedBy: user && user._id,
      userId: user ? user._id : doc.userId,
      order: await getNewOrder({
        collection: models.Tasks,
        stageId: doc.stageId,
        aboveItemId: doc.aboveItemId,
      }),
    };

    if (extendedDoc.customFieldsData) {
      // clean custom field values
      extendedDoc.customFieldsData = await sendTRPCMessage({
        pluginName: 'core',
        method: 'mutation',
        module: 'fields',
        action: 'prepareCustomFieldsData',
        input: {
          data: extendedDoc.customFieldsData,
        },
        defaultValue: [],
      });
    }

    const task = await models.Tasks.createTask(extendedDoc);
    const stage = await models.Stages.getStage(task.stageId);

    // if (user) {
    //   const pipeline = await models.Pipelines.getPipeline(stage.pipelineId);

    //   sendNotifications(models, subdomain, {
    //     item,
    //     user,
    //     type: `${type}Add`,
    //     action: `invited you to the ${pipeline.name}`,
    //     content: `'${item.name}'.`,
    //     contentType: type
    //   });
    // }

    graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
      tasksPipelinesChanged: {
        _id: stage.pipelineId,
        proccessId: doc.proccessId,
        action: 'itemAdd',
        data: {
          item: task,
          aboveItemId: doc.aboveItemId,
          destinationStageId: stage._id,
        },
      },
    });

    return task;
  },

  /**
   * Edit task
   */
  async tasksEdit(
    _root,
    { _id, proccessId, ...doc }: ITask & { _id: string; proccessId: string },
    { user, models }: IContext,
  ) {
    const oldTask = await models.Tasks.getTask(_id);

    const extendedDoc = {
      ...doc,
      modifiedAt: new Date(),
      modifiedBy: user._id,
    };

    const stage = await models.Stages.getStage(oldTask.stageId);

    const { canEditMemberIds } = stage;

    if (
      canEditMemberIds &&
      canEditMemberIds.length > 0 &&
      !canEditMemberIds.includes(user._id)
    ) {
      throw new Error('Permission denied');
    }

    if (extendedDoc.customFieldsData) {
      // clean custom field values
      extendedDoc.customFieldsData = await sendTRPCMessage({
        pluginName: 'core',
        method: 'mutation',
        module: 'fields',
        action: 'prepareCustomFieldsData',
        input: {
          data: extendedDoc.customFieldsData,
        },
        defaultValue: [],
      });
    }

    const updatedItem = await models.Tasks.updateTask(_id, extendedDoc);
    // labels should be copied to newly moved pipeline
    if (doc.stageId) {
      await copyPipelineLabels(models, { item: oldTask, doc, user });
    }

    // const notificationDoc: IBoardNotificationParams = {
    //   item: updatedItem,
    //   user,
    //   type: `${type}Edit`,
    //   contentType: type
    // };

    if (doc.status && oldTask.status && oldTask.status !== doc.status) {
      const activityAction = doc.status === 'active' ? 'activated' : 'archived';

      // order notification
      await changeItemStatus(models, user, {
        item: updatedItem,
        status: activityAction,
        proccessId,
        stage,
      });
    }

    // await sendNotifications(models, subdomain, notificationDoc);

    // if (!notificationDoc.invitedUsers && !notificationDoc.removedUsers) {
    //   sendCoreMessage({
    //     subdomain: "os",
    //     action: "sendMobileNotification",
    //     data: {
    //       title: notificationDoc?.item?.name,
    //       body: `${
    //         user?.details?.fullName || user?.details?.shortName
    //       } has updated`,
    //       receivers: notificationDoc?.item?.assignedUserIds,
    //       data: {
    //         type,
    //         id: _id
    //       }
    //     }
    //   });
    // }

    // exclude [null]
    if (doc.tagIds && doc.tagIds.length) {
      doc.tagIds = doc.tagIds.filter((ti) => ti);
    }

    const updatedStage = await models.Stages.getStage(updatedItem.stageId);

    if (doc.tagIds || doc.startDate || doc.closeDate || doc.name) {
      graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
        tasksPipelinesChanged: {
          _id: stage.pipelineId,
        },
      });
    }

    if (updatedStage.pipelineId !== stage.pipelineId) {
      graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
        tasksPipelinesChanged: {
          _id: stage.pipelineId,
          proccessId,
          action: 'itemRemove',
          data: {
            item: oldTask,
            oldStageId: stage._id,
          },
        },
      });
      graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
        tasksPipelinesChanged: {
          _id: updatedStage.pipelineId,
          proccessId,
          action: 'itemAdd',
          data: {
            item: {
              ...updatedItem,
              ...(await itemResolver(models, user, updatedItem)),
            },
            aboveItemId: '',
            destinationStageId: updatedStage._id,
          },
        },
      });
    } else {
      graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
        tasksPipelinesChanged: {
          _id: stage.pipelineId,
          proccessId,
          action: 'itemUpdate',
          data: {
            item: {
              ...updatedItem,
              ...(await itemResolver(models, user, updatedItem)),
            },
          },
        },
      });
    }

    if (oldTask.stageId === updatedItem.stageId) {
      return updatedItem;
    }

    // // if task moves between stages
    // const { content, action } = await itemMover(
    //   models,
    //   user._id,
    //   oldTask,
    //   updatedItem.stageId
    // );

    // await sendNotifications(models, subdomain, {
    //   item: updatedItem,
    //   user,
    //   type: `${type}Change`,
    //   content,
    //   action,
    //   contentType: type
    // });

    if (updatedItem.assignedUserIds) {
      // sendCoreMessage({
      //   subdomain,
      //   action: 'registerOnboardHistory',
      //   data: {
      //     type: `taskAssignUser`,
      //     user,
      //   },
      // });
    }

    return updatedItem;
  },

  /**
   * Change task
   */
  async tasksChange(
    _root,
    doc: {
      proccessId: string;
      itemId: string;
      aboveItemId?: string;
      destinationStageId: string;
      sourceStageId: string;
    },
    { user, models }: IContext,
  ) {
    const {
      proccessId,
      itemId,
      aboveItemId,
      destinationStageId,
      sourceStageId,
    } = doc;

    const item = await models.Tasks.getTask(itemId);
    const stage = await models.Stages.getStage(item.stageId);

    const extendedDoc: ITask = {
      modifiedAt: new Date(),
      modifiedBy: user._id,
      stageId: destinationStageId,
      order: await getNewOrder({
        collection: models.Tasks,
        stageId: destinationStageId,
        aboveItemId,
      }),
    };

    if (item.stageId !== destinationStageId) {
      checkMovePermission(stage, user);

      const destinationStage = await models.Stages.getStage(destinationStageId);

      checkMovePermission(destinationStage, user);

      extendedDoc.stageChangedDate = new Date();
    }

    const updatedItem = await models.Tasks.updateTask(itemId, extendedDoc);

    // const { content, action } = await itemMover(
    //   models,
    //   user._id,
    //   item,
    //   destinationStageId,
    // );

    // await sendNotifications(models, subdomain, {
    //   item,
    //   user,
    //   type: `${type}Change`,
    //   content,
    //   action,
    //   contentType: type,
    // });

    // if (item?.assignedUserIds && item?.assignedUserIds?.length > 0) {
    //   sendCoreMessage({
    //     subdomain: 'os',
    //     action: 'sendMobileNotification',
    //     data: {
    //       title: `${item.name}`,
    //       body: `${user?.details?.fullName || user?.details?.shortName} ${
    //         action + content
    //       }`,
    //       receivers: item?.assignedUserIds,
    //       data: {
    //         type,
    //         id: item._id,
    //       },
    //     },
    //   });
    // }

    // order notification
    const labels = await models.PipelineLabels.find({
      _id: {
        $in: item.labelIds,
      },
    });

    graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
      tasksPipelinesChanged: {
        _id: stage.pipelineId,
        proccessId,
        action: 'orderUpdated',
        data: {
          item: {
            ...item,
            ...(await itemResolver(models, user, item)),
            labels,
          },
          aboveItemId,
          destinationStageId,
          oldStageId: sourceStageId,
        },
      },
    });

    return updatedItem;
  },

  /**
   * Remove task
   */
  async tasksRemove(_root, { _id }: { _id: string }, { models }: IContext) {
    const task = await models.Tasks.getTask(_id);

    // await sendNotifications(models, subdomain, {
    //   item,
    //   user,
    //   type: `${type}Delete`,
    //   action: `deleted ${type}:`,
    //   content: `'${item.name}'`,
    //   contentType: type,
    // });

    // if (item?.assignedUserIds && item?.assignedUserIds?.length > 0) {
    //   sendCoreMessage({
    //     subdomain: 'os',
    //     action: 'sendMobileNotification',
    //     data: {
    //       title: `${item.name}`,
    //       body: `${
    //         user?.details?.fullName || user?.details?.shortName
    //       } deleted the ${type}`,
    //       receivers: item?.assignedUserIds,
    //       data: {
    //         type,
    //         id: item._id,
    //       },
    //     },
    //   });
    // }

    await models.Checklists.removeChecklists([task._id]);

    const removed = await models.Tasks.findOneAndDelete({ _id: task._id });

    return removed;
  },

  /**
   * Watch task
   */
  async tasksWatch(
    _root,
    { _id, isAdd }: { _id: string; isAdd: boolean },
    { user, models }: IContext,
  ) {
    return models.Tasks.watchTask(_id, isAdd, user._id);
  },

  async tasksCopy(
    _root,
    { _id, proccessId }: { _id: string; proccessId: string },
    { user, models }: IContext,
  ) {
    const item = await models.Tasks.getTask(_id);

    const doc = {
      ...item,
      _id: undefined,
      userId: user._id,
      modifiedBy: user._id,
      watchedUserIds: [user._id],
      assignedUserIds: item.assignedUserIds,
      name: `${item.name}-copied`,
      initialStageId: item.initialStageId,
      stageId: item.stageId,
      description: item.description,
      priority: item.priority,
      labelIds: item.labelIds,
      order: await getNewOrder({
        collection: models.Tasks,
        stageId: item.stageId,
        aboveItemId: item._id,
      }),

      attachments: (item.attachments || []).map((a) => ({
        url: a.url,
        name: a.name,
        type: a.type,
        size: a.size,
      })),
    };

    delete doc.sourceConversationIds;

    const clone = await models.Tasks.createTask(doc);

    const originalChecklists = await models.Checklists.find({
      contentTypeId: _id,
    }).lean();

    const clonedChecklists = await models.Checklists.insertMany(
      originalChecklists.map((originalChecklist) => ({
        contentTypeId: clone._id,
        title: originalChecklist.title,
        createdUserId: user._id,
        createdDate: new Date(),
      })),
      { ordered: true },
    );

    const originalChecklistIdToClonedId = new Map<string, string>();

    for (let i = 0; i < originalChecklists.length; i++) {
      originalChecklistIdToClonedId.set(
        originalChecklists[i]._id,
        clonedChecklists[i]._id,
      );
    }

    const originalChecklistItems = await models.ChecklistItems.find({
      checklistId: { $in: originalChecklists.map((x) => x._id) },
    }).lean();

    await models.ChecklistItems.insertMany(
      originalChecklistItems.map(({ content, order, checklistId }) => ({
        checklistId: originalChecklistIdToClonedId.get(checklistId),
        isChecked: false,
        createdUserId: user._id,
        createdDate: new Date(),
        content,
        order,
      })),
      { ordered: false },
    );

    // order notification
    const stage = await models.Stages.getStage(clone.stageId);

    graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
      tasksPipelinesChanged: {
        _id: stage.pipelineId,
        proccessId,
        action: 'itemAdd',
        data: {
          item: {
            ...clone,
            ...(await itemResolver(models, user, clone)),
          },
          aboveItemId: _id,
          destinationStageId: stage._id,
        },
      },
    });
    graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
      tasksPipelinesChanged: {
        _id: stage.pipelineId,
        proccessId: Math.random().toString(),
        action: 'itemOfConformitiesUpdate',
        data: {
          item: {
            ...item,
          },
        },
      },
    });

    return clone;
  },

  async tasksArchive(
    _root,
    { stageId, proccessId }: { stageId: string; proccessId: string },
    { models }: IContext,
  ) {
    const items = await models.Tasks.find({
      stageId,
      status: { $ne: TASK_STATUSES.ARCHIVED },
    }).lean();

    await models.Tasks.updateMany(
      { stageId },
      { $set: { status: TASK_STATUSES.ARCHIVED } },
    );

    // order notification
    const stage = await models.Stages.getStage(stageId);

    for (const item of items) {
      graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
        tasksPipelinesChanged: {
          _id: stage.pipelineId,
          proccessId,
          action: 'itemsRemove',
          data: {
            item,
            destinationStageId: stage._id,
          },
        },
      });
    }

    return 'ok';
  },
};
