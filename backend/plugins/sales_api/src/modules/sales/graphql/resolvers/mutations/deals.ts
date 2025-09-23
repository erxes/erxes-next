import { can } from 'erxes-api-shared/core-modules';
import { checkUserIds, sendTRPCMessage } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { IDeal, IDealDocument, IProductData } from '~/modules/sales/@types';
import { SALES_STATUSES } from '~/modules/sales/constants';
import {
  checkMovePermission,
  createConformity,
  getCompanyIds,
  getCustomerIds,
  destroyBoardItemRelations,
  getNewOrder,
  getTotalAmounts,
} from '~/modules/sales/utils';
import {
  changeItemStatus,
  checkAssignedUserFromPData,
  copyChecklists,
  copyPipelineLabels,
  itemMover,
  subscriptionWrapper,
} from './utils';

export const dealMutations = {
  /**
   * Creates a new deal
   */
  async dealsAdd(
    _root,
    doc: IDeal & { proccessId: string; aboveItemId: string },
    { user, models }: IContext,
  ) {
    doc.initialStageId = doc.stageId;
    doc.watchedUserIds = user && [user._id];

    const extendedDoc = {
      ...doc,
      modifiedBy: user && user._id,
      userId: user ? user._id : doc.userId,
      order: await getNewOrder({
        collection: models.Deals,
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

    const deal = await models.Deals.createDeal(extendedDoc);

    const stage = await models.Stages.getStage(deal.stageId);

    await createConformity({
      mainType: 'deal',
      mainTypeId: deal._id,
      companyIds: doc.companyIds,
      customerIds: doc.customerIds,
    });

    //   if (user) {
    //     const pipeline = await models.Pipelines.getPipeline(stage.pipelineId);

    // sendNotifications(models, subdomain, {
    //   item,
    //   user,
    //   type: `${type}Add`,
    //   action: `invited you to the ${pipeline.name}`,
    //   content: `'${item.name}'.`,
    //   contentType: type,
    // });

    await subscriptionWrapper(models, { action: 'create', deal, pipelineId: stage.pipelineId });
    return deal;
  },

  /**
   * Edits a deal
   */
  async dealsEdit(
    _root,
    { _id, proccessId, ...doc }: IDealDocument & { proccessId: string },
    { user, models }: IContext,
  ) {
    const oldDeal = await models.Deals.getDeal(_id);

    if (doc.assignedUserIds) {
      const { removedUserIds } = checkUserIds(
        oldDeal.assignedUserIds,
        doc.assignedUserIds
      );
      const oldAssignedUserPdata = (oldDeal.productsData || [])
        .filter((pdata) => pdata.assignUserId)
        .map((pdata) => pdata.assignUserId || "");
      const cantRemoveUserIds = removedUserIds.filter((userId) =>
        oldAssignedUserPdata.includes(userId)
      );

      if (cantRemoveUserIds.length > 0) {
        throw new Error(
          "Cannot remove the team member, it is assigned in the product / service section"
        );
      }
    }

    if (doc.productsData) {
      const { assignedUserIds } = checkAssignedUserFromPData(
        oldDeal.assignedUserIds,
        doc.productsData
          .filter((pdata) => pdata.assignUserId)
          .map((pdata) => pdata.assignUserId || ""),
        oldDeal.productsData
      );

      doc.assignedUserIds = assignedUserIds;

      // doc.productsData = await checkPricing(subdomain, models, { ...oldDeal, ...doc })
    }

    // await doScoreCampaign(subdomain, models, _id, doc);
    // await confirmLoyalties(subdomain, _id, doc);

    const extendedDoc = {
      ...doc,
      modifiedAt: new Date(),
      modifiedBy: user._id,
    };

    const stage = await models.Stages.getStage(oldDeal.stageId);

    const { canEditMemberIds } = stage;

    if (
      canEditMemberIds &&
      canEditMemberIds.length > 0 &&
      !canEditMemberIds.includes(user._id)
    ) {
      throw new Error('Permission denied');
    }

    if (
      doc.status === 'archived' &&
      oldDeal.status === 'active' &&
      !(await can('dealsArchive', user))
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

    const updatedItem = await models.Deals.updateDeal(_id, extendedDoc);
    // labels should be copied to newly moved pipeline
    if (updatedItem.stageId !== oldDeal.stageId) {
      await copyPipelineLabels(models, { item: oldDeal, doc, user });
    }

    // const notificationDoc: IBoardNotificationParams = {
    const notificationDoc: any = {
      item: updatedItem,
      user,
      type: `dealEdit`,
      contentType: 'deal',
    };

    if (doc.status && oldDeal.status && oldDeal.status !== doc.status) {
      const activityAction = doc.status === 'active' ? 'activated' : 'archived';

      // putActivityLog(subdomain, {
      //   action: "createArchiveLog",
      //   data: {
      //     item: updatedItem,
      //     contentType: type,
      //     action: "archive",
      //     userId: user._id,
      //     createdBy: user._id,
      //     contentId: updatedItem._id,
      //     content: activityAction,
      //   },
      // });

      // order notification
      await changeItemStatus(models, user, {
        item: updatedItem,
        status: activityAction,
        proccessId,
        stage,
      });
    }

    if (doc.assignedUserIds) {
      const { addedUserIds, removedUserIds } = checkUserIds(
        oldDeal.assignedUserIds,
        doc.assignedUserIds,
      );

      // const activityContent = { addedUserIds, removedUserIds };

      // putActivityLog(subdomain, {
      //   action: "createAssigneLog",
      //   data: {
      //     contentId: _id,
      //     userId: user._id,
      //     contentType: type,
      //     content: activityContent,
      //     action: "assignee",
      //     createdBy: user._id,
      //   },
      // });

      notificationDoc.invitedUsers = addedUserIds;
      notificationDoc.removedUsers = removedUserIds;
    }

    // await sendNotifications(models, subdomain, notificationDoc);

    if (!notificationDoc.invitedUsers && !notificationDoc.removedUsers) {
      // sendCoreMessage({
      //   subdomain: "os",
      //   action: "sendMobileNotification",
      //   data: {
      //     title: notificationDoc?.item?.name,
      //     body: `${user?.details?.fullName || user?.details?.shortName
      //       } has updated`,
      //     receivers: notificationDoc?.item?.assignedUserIds,
      //     data: {
      //       type,
      //       id: _id,
      //     },
      //   },
      // });
    }

    // exclude [null]
    if (doc.tagIds && doc.tagIds.length) {
      doc.tagIds = doc.tagIds.filter((ti) => ti);
    }

    const updatedStage = await models.Stages.getStage(updatedItem.stageId);
    await subscriptionWrapper(models, { action: 'update', deal: updatedItem, oldDeal, pipelineId: stage.pipelineId });

    // if (updatedStage.pipelineId !== stage.pipelineId) {
    //   graphqlPubsub.publish(`salesPipelinesChanged:${stage.pipelineId}`, {
    //     salesPipelinesChanged: {
    //       _id: stage.pipelineId,
    //       proccessId,
    //       action: "itemRemove",
    //       data: {
    //         item: oldDeal,
    //         oldStageId: stage._id,
    //       },
    //     },
    //   });
    //   graphqlPubsub.publish(`salesPipelinesChanged:${stage.pipelineId}`, {
    //     salesPipelinesChanged: {
    //       _id: updatedStage.pipelineId,
    //       proccessId,
    //       action: "itemAdd",
    //       data: {
    //         item: {
    //           ...updatedItem._doc,
    //           ...(await itemResolver(models, subdomain, user, type, updatedItem)),
    //         },
    //         aboveItemId: "",
    //         destinationStageId: updatedStage._id,
    //       },
    //     },
    //   });
    // } else {
    //   graphqlPubsub.publish(`salesPipelinesChanged:${stage.pipelineId}`, {
    //     salesPipelinesChanged: {
    //       _id: stage.pipelineId,
    //       proccessId,
    //       action: "itemUpdate",
    //       data: {
    //         item: {
    //           ...updatedItem._doc,
    //           ...(await itemResolver(models, subdomain, user, type, updatedItem)),
    //         },
    //       },
    //     },
    //   });
    // }

    // await doScoreCampaign(subdomain, models, _id, updatedItem);

    if (oldDeal.stageId === updatedItem.stageId) {
      return updatedItem;
    }

    // if task moves between stages
    await itemMover(
      models,
      user._id,
      oldDeal,
      updatedItem.stageId
    );

    return updatedItem;

  },

  /**
   * Change deal
   */
  async dealsChange(
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
      itemId,
      aboveItemId,
      sourceStageId,
      destinationStageId,
    } = doc;

    const item = await models.Deals.findOne({ _id: itemId });

    if (!item) {
      throw new Error('Deal not found');
    }

    const stage = await models.Stages.getStage(item.stageId);

    const extendedDoc: IDeal = {
      modifiedBy: user._id,
      stageId: destinationStageId,
      order: await getNewOrder({
        collection: models.Deals,
        stageId: destinationStageId,
        aboveItemId,
      }),
    };

    if (item.stageId !== destinationStageId) {
      checkMovePermission(stage, user);

      const destinationStage = await models.Stages.getStage(destinationStageId);

      checkMovePermission(destinationStage, user);

      //   await doScoreCampaign(subdomain, models, itemId, {
      //     ...item.toObject(),
      //     ...extendedDoc,
      //   });

      extendedDoc.stageChangedDate = new Date();
    }

    const updatedItem = await models.Deals.updateDeal(itemId, extendedDoc);

    await itemMover(
      models,
      user._id,
      item,
      destinationStageId,
    );
    await subscriptionWrapper(models, { action: 'update', deal: updatedItem, oldDeal: item, pipelineId: stage.pipelineId });

    return updatedItem;
  },

  /**
   * Remove deal
   */
  async dealsRemove(
    _root,
    { _id }: { _id: string },
    { user, models }: IContext,
  ) {
    const item = await models.Deals.findOne({ _id });

    if (!item) {
      throw new Error('Deal not found');
    }

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

    await destroyBoardItemRelations(models, item._id);

    const removed = await models.Deals.findOneAndDelete({ _id: item._id });

    await subscriptionWrapper(models, { action: 'delete', dealId: item._id, oldDeal: item });

    return removed;
  },

  /**
   * Watch deal
   */
  async dealsWatch(
    _root,
    { _id, isAdd }: { _id: string; isAdd: boolean },
    { user, models }: IContext,
  ) {
    return models.Deals.watchDeal(_id, isAdd, user._id);
  },

  async dealsCopy(
    _root,
    { _id, proccessId }: { _id: string; proccessId: string },
    { user, models }: IContext,
  ) {
    const item = await models.Deals.findOne({ _id }).lean();

    if (!item) {
      throw new Error('No Item Found');
    }

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
        collection: models.Deals,
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

    for (const param of ['productsData', 'paymentsData']) {
      doc[param] = item[param];
    }

    const clone = await models.Deals.createDeal(doc);

    const companyIds = await getCompanyIds('deal', _id);
    const customerIds = await getCustomerIds('deal', _id);

    await createConformity({
      mainType: 'deal',
      mainTypeId: clone._id,
      customerIds,
      companyIds,
    });

    await copyChecklists(models, {
      contentType: 'deal',
      contentTypeId: item._id,
      targetContentId: clone._id,
      user,
    });

    // order notification
    // const stage = await models.Stages.getStage(clone.stageId);

    // graphqlPubsub.publish(`salesPipelinesChanged:${stage.pipelineId}`, {
    //   salesPipelinesChanged: {
    //     _id: stage.pipelineId,
    //     proccessId,
    //     action: 'itemAdd',
    //     data: {
    //       item: {
    //         ...clone._doc,
    //         ...(await itemResolver(models, subdomain, user, type, clone)),
    //       },
    //       aboveItemId: _id,
    //       destinationStageId: stage._id,
    //     },
    //   },
    // });

    // await publishHelperItemsConformities(clone, stage);

    return clone;
  },

  async dealsArchive(
    _root,
    { stageId, proccessId }: { stageId: string; proccessId: string },
    { user, models }: IContext,
  ) {
    // const items = await models.Deals.find({
    //   stageId,
    //   status: { $ne: SALES_STATUSES.ARCHIVED },
    // }).lean();

    await models.Deals.updateMany(
      { stageId },
      { $set: { status: SALES_STATUSES.ARCHIVED } },
    );

    // order notification
    // const stage = await models.Stages.getStage(stageId);

    // for (const item of items) {
    //   await putActivityLog(subdomain, {
    //     action: 'createArchiveLog',
    //     data: {
    //       item,
    //       contentType: type,
    //       action: 'archive',
    //       userId: user._id,
    //       createdBy: user._id,
    //       contentId: item._id,
    //       content: 'archived',
    //     },
    //   });

    //   graphqlPubsub.publish(`salesPipelinesChanged:${stage.pipelineId}`, {
    //     salesPipelinesChanged: {
    //       _id: stage.pipelineId,
    //       proccessId,
    //       action: 'itemsRemove',
    //       data: {
    //         item,
    //         destinationStageId: stage._id,
    //       },
    //     },
    //   });
    // }

    return 'ok';
  },

  async dealsCreateProductsData(
    _root,
    {
      proccessId,
      dealId,
      docs,
    }: {
      proccessId: string;
      dealId: string;
      docs: IProductData[];
    },
    { models, user }: IContext,
  ) {
    const deal = await models.Deals.getDeal(dealId);
    const stage = await models.Stages.getStage(deal.stageId);

    const oldDataIds = (deal.productsData || []).map((pd) => pd._id);

    const { assignedUserIds, addedUserIds, removedUserIds } = checkAssignedUserFromPData(
      deal.assignedUserIds,
      [
        ...(deal.productsData || [])
          .filter((pdata) => pdata.assignUserId)
          .map((pdata) => pdata.assignUserId || ""),
        ...docs
          .filter((pdata) => pdata.assignUserId)
          .map((pdata) => pdata.assignUserId || ""),
      ],
      deal.productsData
    );

    for (const doc of docs) {
      if (doc._id) {
        const checkDup = (deal.productsData || []).find(
          (pd) => pd._id === doc._id,
        );
        if (checkDup) {
          throw new Error('Deals productData duplicated');
        }
      }
    }

    // undefenid or null then true
    const tickUsed = !(stage.defaultTick === false);
    const addDocs = (docs || []).map(
      (doc) => ({ ...doc, tickUsed } as IProductData),
    );
    const productsData: IProductData[] = (deal.productsData || []).concat(
      addDocs,
    );

    await models.Deals.updateOne({ _id: dealId }, {
      $set: {
        productsData,
        assignedUserIds,
        ...await getTotalAmounts(productsData)
      }
    });

    const updatedItem =
      (await models.Deals.findOne({ _id: dealId })) || ({} as any);



    const dataIds = (updatedItem.productsData || [])
      .filter((pd) => !oldDataIds.includes(pd._id))
      .map((pd) => pd._id);

    // graphqlPubsub.publish(`salesProductsDataChanged:${dealId}`, {
    //   salesProductsDataChanged: {
    //     _id: dealId,
    //     proccessId,
    //     action: 'create',
    //     data: {
    //       dataIds,
    //       docs,
    //       productsData,
    //     },
    //   },
    // });

    return {
      dataIds,
      productsData,
    };
  },

  async dealsEditProductData(
    _root,
    {
      proccessId,
      dealId,
      dataId,
      doc,
    }: {
      proccessId: string;
      dealId: string;
      dataId: string;
      doc: IProductData;
    },
    { models, user }: IContext,
  ) {
    const deal = await models.Deals.getDeal(dealId);

    if (!deal.productsData?.length) {
      throw new Error("Deals productData not found");
    }

    const oldPData = (deal.productsData || []).find(
      (pdata) => pdata._id === dataId,
    );

    if (!oldPData) {
      throw new Error('Deals productData not found');
    }

    const productsData: IProductData[] = (deal.productsData || []).map((data) =>
      data._id === dataId ? { ...doc } : data,
    );

    const possibleAssignedUsersIds: string[] = (deal.productsData || [])
      .filter((pdata) => pdata._id !== dataId && pdata.assignUserId)
      .map((pdata) => pdata.assignUserId || "");

    if (doc.assignUserId) {
      possibleAssignedUsersIds.push(doc.assignUserId)
    }

    const { assignedUserIds, addedUserIds, removedUserIds } = checkAssignedUserFromPData(
      deal.assignedUserIds,
      possibleAssignedUsersIds,
      deal.productsData
    );

    await models.Deals.updateOne({ _id: dealId }, {
      $set: {
        productsData,
        assignedUserIds,
        ...await getTotalAmounts(productsData)
      }
    });

    // const stage = await models.Stages.getStage(deal.stageId);
    // const updatedItem =
    //   (await models.Deals.findOne({ _id: dealId })) || ({} as any);

    // graphqlPubsub.publish(`salesPipelinesChanged:${stage.pipelineId}`, {
    //   salesPipelinesChanged: {
    //     _id: stage.pipelineId,
    //     proccessId,
    //     action: 'itemUpdate',
    //     data: {
    //       item: {
    //         ...updatedItem,
    //         ...(await itemResolver(
    //           models,
    //           subdomain,
    //           user,
    //           'deal',
    //           updatedItem,
    //         )),
    //       },
    //     },
    //   },
    // });

    // graphqlPubsub.publish(`salesProductsDataChanged:${dealId}`, {
    //   salesProductsDataChanged: {
    //     _id: dealId,
    //     proccessId,
    //     action: 'edit',
    //     data: {
    //       dataId,
    //       doc,
    //       productsData,
    //     },
    //   },
    // });

    return {
      dataId,
      productsData,
    };
  },

  async dealsDeleteProductData(
    _root,
    {
      proccessId,
      dealId,
      dataId,
    }: {
      proccessId: string;
      dealId: string;
      dataId: string;
    },
    { models, user }: IContext,
  ) {
    const deal = await models.Deals.getDeal(dealId);

    const oldPData = (deal.productsData || []).find(
      (pdata) => pdata._id === dataId,
    );

    if (!oldPData) {
      throw new Error('Deals productData not found');
    }

    const productsData = (deal.productsData || []).filter(
      (data) => data._id !== dataId,
    );

    await models.Deals.updateOne({ _id: dealId }, {
      $set: {
        productsData,
        ...await getTotalAmounts(productsData)
      }
    });

    // const stage = await models.Stages.getStage(deal.stageId);
    // const updatedItem =
    //   (await models.Deals.findOne({ _id: dealId })) || ({} as any);

    // graphqlPubsub.publish(`salesPipelinesChanged:${stage.pipelineId}`, {
    //   salesPipelinesChanged: {
    //     _id: stage.pipelineId,
    //     proccessId,
    //     action: 'itemUpdate',
    //     data: {
    //       item: {
    //         ...updatedItem,
    //         ...(await itemResolver(
    //           models,
    //           subdomain,
    //           user,
    //           'deal',
    //           updatedItem,
    //         )),
    //       },
    //     },
    //   },
    // });

    // graphqlPubsub.publish(`salesProductsDataChanged:${dealId}`, {
    //   salesProductsDataChanged: {
    //     _id: dealId,
    //     proccessId,
    //     action: 'delete',
    //     data: {
    //       dataId,
    //       productsData,
    //     },
    //   },
    // });

    return {
      dataId,
      productsData,
    };
  },
};
