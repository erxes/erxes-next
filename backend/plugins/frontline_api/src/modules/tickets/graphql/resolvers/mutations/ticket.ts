import {
  checkUserIds,
  graphqlPubsub,
  sendTRPCMessage,
} from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { ITicket } from '~/modules/tickets/@types/ticket';
import { TICKET_STATUSES } from '~/modules/tickets/constants';
import {
  checkMovePermission,
  copyPipelineLabels,
  getNewOrder,
  ticketResolver,
} from '~/modules/tickets/utils';

export const ticketMutations = {
  /**
   * Create new ticket
   */
  async ticketsAdd(
    _root: undefined,
    doc: ITicket & { proccessId: string; aboveItemId: string },
    { user, models }: IContext,
  ) {
    doc.initialStageId = doc.stageId;
    doc.watchedUserIds = user && [user._id];

    const extendedDoc = {
      ...doc,
      modifiedBy: user && user._id,
      userId: user ? user._id : doc.userId,
      order: await getNewOrder({
        collection: models.Tickets,
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
          customFieldsData: extendedDoc.customFieldsData,
        },
        defaultValue: [],
      });
    }

    const ticket = await models.Tickets.createTicket(extendedDoc);
    const stage = await models.Stages.getStage(ticket.stageId);

    // if (user) {
    // //   const pipeline = await models.Pipelines.getPipeline(stage.pipelineId);

    //   // sendNotifications(models, subdomain, {
    //   //   ticket,
    //   //   user,
    //   //   type: `${type}Add`,
    //   //   action: `invited you to the ${pipeline.name}`,
    //   //   content: `'${ticket.name}'.`,
    //   //   contentType: type
    //   // });
    // }

    graphqlPubsub.publish(`ticketsPipelinesChanged:${stage.pipelineId}`, {
      ticketsPipelinesChanged: {
        _id: stage.pipelineId,
        proccessId: doc.proccessId,
        action: 'itemAdd',
        data: {
          item: ticket,
          aboveItemId: doc.aboveItemId,
          destinationStageId: stage._id,
        },
      },
    });

    return ticket;
  },
  /**
   * Edit ticket
   */
  async ticketsEdit(
    _root: undefined,
    { _id, proccessId, ...doc }: ITicket & { _id: string; proccessId: string },
    { user, models, subdomain }: IContext,
  ) {
    const ticket = await models.Tickets.getTicket(_id);

    const extendedDoc = {
      ...doc,
      modifiedAt: new Date(),
      modifiedBy: user._id,
    };

    const stage = await models.Stages.getStage(ticket.stageId);

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
          customFieldsData: extendedDoc.customFieldsData,
        },
        defaultValue: [],
      });
    }

    const updatedItem = await models.Tickets.updateTicket(_id, extendedDoc);
    // labels should be copied to newly moved pipeline
    if (doc.stageId) {
      await copyPipelineLabels(models, { item: ticket, doc, user });
    }

    // const notificationDoc: IBoardNotificationParams = {
    //   item: updatedItem,
    //   user,
    //   type: `${type}Edit`,
    //   contentType: type,
    // };

    if (doc.status && ticket.status && ticket.status !== doc.status) {
      const activityAction = doc.status === 'active' ? 'activated' : 'archived';

      // order notification
      if (activityAction === 'archived') {
        graphqlPubsub.publish(`ticketsPipelinesChanged:${stage.pipelineId}`, {
          ticketsPipelinesChanged: {
            _id: stage.pipelineId,
            proccessId,
            action: 'itemRemove',
            data: {
              ticket,
              oldStageId: ticket.stageId,
            },
          },
        });

        return;
      }
    }
    if (doc.assignedUserIds) {
      const { addedUserIds, removedUserIds } = checkUserIds(
        ticket.assignedUserIds,
        doc.assignedUserIds,
      );

      const activityContent = { addedUserIds, removedUserIds };

      //   notificationDoc.invitedUsers = addedUserIds;
      //   notificationDoc.removedUsers = removedUserIds;
    }

    // await sendNotifications(models, subdomain, notificationDoc);

    // if (!notificationDoc.invitedUsers && !notificationDoc.removedUsers) {
    //   sendCoreMessage({
    //     subdomain: 'os',
    //     action: 'sendMobileNotification',
    //     data: {
    //       title: notificationDoc?.item?.name,
    //       body: `${
    //         user?.details?.fullName || user?.details?.shortName
    //       } has updated`,
    //       receivers: notificationDoc?.item?.assignedUserIds,
    //       data: {
    //         type,
    //         id: _id,
    //       },
    //     },
    //   });
    // }

    // exclude [null]
    if (doc.tagIds && doc.tagIds.length) {
      doc.tagIds = doc.tagIds.filter((ti) => ti);
    }

    const updatedStage = await models.Stages.getStage(updatedItem.stageId);

    if (doc.tagIds || doc.startDate || doc.closeDate || doc.name) {
      graphqlPubsub.publish(`ticketsPipelinesChanged:${stage.pipelineId}`, {
        ticketsPipelinesChanged: {
          _id: stage.pipelineId,
        },
      });
    }

    if (updatedStage.pipelineId !== stage.pipelineId) {
      graphqlPubsub.publish(`ticketsPipelinesChanged:${stage.pipelineId}`, {
        ticketsPipelinesChanged: {
          _id: stage.pipelineId,
          proccessId,
          action: 'itemRemove',
          data: {
            item: ticket,
            oldStageId: stage._id,
          },
        },
      });
      graphqlPubsub.publish(`ticketsPipelinesChanged:${stage.pipelineId}`, {
        ticketsPipelinesChanged: {
          _id: updatedStage.pipelineId,
          proccessId,
          action: 'itemAdd',
          data: {
            item: {
              ...updatedItem,
              ...(await ticketResolver(models, subdomain, user, updatedItem)),
            },
            aboveItemId: '',
            destinationStageId: updatedStage._id,
          },
        },
      });
    } else {
      graphqlPubsub.publish(`ticketsPipelinesChanged:${stage.pipelineId}`, {
        ticketsPipelinesChanged: {
          _id: stage.pipelineId,
          proccessId,
          action: 'itemUpdate',
          data: {
            item: {
              ...updatedItem,
              ...(await ticketResolver(models, subdomain, user, updatedItem)),
            },
          },
        },
      });
    }

    if (ticket.stageId === updatedItem.stageId) {
      return updatedItem;
    }

    // if task moves between stages
    // const { content, action } = await itemMover(
    //   models,
    //   user._id,
    //   ticket,
    //   updatedItem.stageId,
    // );

    //   await sendNotifications(models, subdomain, {
    //     item: updatedItem,
    //     user,
    //     type: `${type}Change`,
    //     content,
    //     action,
    //     contentType: type
    //   });

    return updatedItem;
  },

  /**
   * Change ticket
   */
  async ticketsChange(
    _root: undefined,
    doc: {
      proccessId: string;
      itemId: string;
      aboveItemId?: string;
      destinationStageId: string;
      sourceStageId: string;
    },
    { user, models, subdomain }: IContext,
  ) {
    const {
      proccessId,
      itemId,
      aboveItemId,
      destinationStageId,
      sourceStageId,
    } = doc;

    const ticket = await models.Tickets.getTicket(itemId);
    const stage = await models.Stages.getStage(ticket.stageId);

    const extendedDoc: ITicket = {
      modifiedAt: new Date(),
      modifiedBy: user._id,
      stageId: destinationStageId,
      order: await getNewOrder({
        collection: models.Tickets,
        stageId: destinationStageId,
        aboveItemId,
      }),
    };

    if (ticket.stageId !== destinationStageId) {
      checkMovePermission(stage, user);

      const destinationStage = await models.Stages.getStage(destinationStageId);

      checkMovePermission(destinationStage, user);

      extendedDoc.stageChangedDate = new Date();
    }

    const updatedItem = await models.Tickets.updateTicket(itemId, extendedDoc);

    // const { content, action } = await itemMover(
    //   models,
    //   subdomain,
    //   user._id,
    //   ticket,
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

    // if (ticket?.assignedUserIds && ticket?.assignedUserIds?.length > 0) {
    //   sendCoreMessage({
    //     subdomain: 'os',
    //     action: 'sendMobileNotification',
    //     data: {
    //       title: `${ticket.name}`,
    //       body: `${user?.details?.fullName || user?.details?.shortName} ${
    //         action + content
    //       }`,
    //       receivers: ticket?.assignedUserIds,
    //       data: {
    //         type,
    //         id: ticket._id,
    //       },
    //     },
    //   });
    // }

    // order notification
    const labels = await models.PipelineLabels.find({
      _id: {
        $in: ticket.labelIds,
      },
    });

    graphqlPubsub.publish(`ticketsPipelinesChanged:${stage.pipelineId}`, {
      ticketsPipelinesChanged: {
        _id: stage.pipelineId,
        proccessId,
        action: 'orderUpdated',
        data: {
          item: {
            ...ticket,
            ...(await ticketResolver(models, subdomain, user, ticket)),
            labels,
          },
          aboveItemId,
          destinationStageId,
          oldStageId: sourceStageId,
        },
      },
    });

    return ticket;
  },

  /**
   * Remove ticket
   */
  async ticketsRemove(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    const ticket = await models.Tickets.getTicket(_id);

    // await sendNotifications(models, subdomain, {
    //   ticket,
    //   user,
    //   type: `ticketDelete`,
    //   action: `deleted ticket:`,
    //   content: `'${ticket.name}'`,
    //   contentType: 'ticket'
    // });

    // if (ticket?.assignedUserIds && ticket?.assignedUserIds?.length > 0) {
    //   sendCoreMessage({
    //     subdomain: "os",
    //     action: "sendMobileNotification",
    //     data: {
    //       title: `${ticket.name}`,
    //       body: `${user?.details?.fullName || user?.details?.shortName} deleted the ticket`,
    //       receivers: ticket?.assignedUserIds,
    //       data: {
    //         type: 'ticket',
    //         id: ticket._id
    //       }
    //     }
    //   });
    // }

    return await models.Tickets.findOneAndDelete({ _id: ticket._id });
  },

  /**
   * Watch ticket
   */
  async ticketsWatch(
    _root: undefined,
    { _id, isAdd }: { _id: string; isAdd: boolean },
    { user, models }: IContext,
  ) {
    return models.Tickets.watchTicket(_id, isAdd, user._id);
  },

  async ticketsCopy(
    _root: undefined,
    { _id, proccessId }: { _id: string; proccessId: string },
    { user, models, subdomain }: IContext,
  ) {
    const item = await models.Tickets.getTicket(_id);

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
        collection: models.Tickets,
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

    for (const param of ['source']) {
      doc[param] = item[param];
    }

    const clone = await models.Tickets.create(doc);

    //   const companyIds = await getCompanyIds(subdomain, type, _id);
    //   const customerIds = await getCustomerIds(subdomain, type, _id);

    const originalChecklists = await models.CheckLists.find({
      contentTypeId: item._id,
    }).lean();

    const clonedChecklists = await models.CheckLists.insertMany(
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

    const originalChecklistItems = await models.CheckListItems.find({
      checklistId: { $in: originalChecklists.map((x) => x._id) },
    }).lean();

    await models.CheckListItems.insertMany(
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

    graphqlPubsub.publish(`ticketsPipelinesChanged:${stage.pipelineId}`, {
      ticketsPipelinesChanged: {
        _id: stage.pipelineId,
        proccessId,
        action: 'itemAdd',
        data: {
          item: {
            ...clone,
            ...(await ticketResolver(models, subdomain, user, clone)),
          },
          aboveItemId: _id,
          destinationStageId: stage._id,
        },
      },
    });

    graphqlPubsub.publish(`ticketsPipelinesChanged:${stage.pipelineId}`, {
      ticketsPipelinesChanged: {
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

  async ticketsArchive(
    _root: undefined,
    { stageId, proccessId }: { stageId: string; proccessId: string },
    { models }: IContext,
  ) {
    const tickets = await models.Tickets.find({
      stageId,
      status: { $ne: TICKET_STATUSES.ARCHIVED },
    }).lean();

    await models.Tickets.updateMany(
      { stageId },
      { $set: { status: TICKET_STATUSES.ARCHIVED } },
    );

    // order notification
    const stage = await models.Stages.getStage(stageId);

    for (const ticket of tickets) {
      graphqlPubsub.publish(`ticketsPipelinesChanged:${stage.pipelineId}`, {
        ticketsPipelinesChanged: {
          _id: stage.pipelineId,
          proccessId,
          action: 'itemsRemove',
          data: {
            item: ticket,
            destinationStageId: stage._id,
          },
        },
      });
    }

    return 'ok';
  },
};
