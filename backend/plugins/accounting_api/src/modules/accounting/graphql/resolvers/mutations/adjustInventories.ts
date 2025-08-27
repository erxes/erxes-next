import { graphqlPubsub } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { IAdjustInventory, ADJ_INV_STATUSES } from '@/accounting/@types/adjustInventory';
import { adjustRunning, checkValidDate } from '../../../utils/inventories';

const adjustInventoryMutations = {
  async adjustInventoryAdd(
    _root,
    doc: IAdjustInventory,
    { user, models }: IContext
  ) {
    const { beginDate } = await checkValidDate(models, doc);

    const adjusting = await models.AdjustInventories.createAdjustInventory({ ...doc, beginDate, createdBy: user._id });
    return adjusting;
  },

  async adjustInventoryPublish(_root, { adjustId }: { adjustId: string }, { models, user }: IContext) {
    const adjusting = await models.AdjustInventories.getAdjustInventory(adjustId);
    if (adjusting.status === ADJ_INV_STATUSES.PUBLISH) {
      throw new Error('this adjusting is published');
    }
    if (adjusting.status !== ADJ_INV_STATUSES.COMPLETE) {
      throw new Error('This adjusting cannot be published yet.');
    }

    const betweenModifiedTrs = await models.Transactions.find({

    }).lean()

    if (betweenModifiedTrs.length) {
      await models.AdjustInventories.updateOne({ _id: adjustId }, { $set: { status: ADJ_INV_STATUSES.PROCESS, modifiedBy: '' } });

      graphqlPubsub.publish(`accountingAdjustInventoryChanged:${adjustId}`, {
        accountingAdjustInventoryChanged: {
          ...adjusting,
          status: ADJ_INV_STATUSES.PROCESS,
          modifiedBy: ''
        },
      });
      throw new Error('This adjusting cannot be published yet. Cause: modified some transactions');
    }

    await models.AdjustInventories.updateOne({ _id: adjustId }, { $set: { status: ADJ_INV_STATUSES.PUBLISH, modifiedBy: user._id } });

    graphqlPubsub.publish(`accountingAdjustInventoryChanged:${adjustId}`, {
      accountingAdjustInventoryChanged: {
        ...adjusting,
        status: ADJ_INV_STATUSES.PUBLISH,
        modifiedBy: user._id
      },
    });

    return await models.AdjustInventories.getAdjustInventory(adjustId);
  },

  async adjustInventoryCancel(_root, { adjustId }: { adjustId: string }, { models, user }: IContext) {
    const adjusting = await models.AdjustInventories.getAdjustInventory(adjustId);
    if (adjusting.status !== ADJ_INV_STATUSES.PUBLISH) {
      throw new Error('this adjusting cannot be cancel yet, it has not been published.');
    }
    await models.AdjustInventories.updateOne({ _id: adjustId }, { $set: { status: ADJ_INV_STATUSES.DRAFT, modifiedBy: user._id } });
    graphqlPubsub.publish(`accountingAdjustInventoryChanged:${adjustId}`, {
      accountingAdjustInventoryChanged: {
        ...adjusting,
        status: ADJ_INV_STATUSES.DRAFT,
        modifiedBy: user._id
      },
    });

    return await models.AdjustInventories.getAdjustInventory(adjustId);
  },

  async adjustInventoryRemove(_root, { adjustId }: { adjustId: string }, { models }: IContext) {
    return await models.AdjustInventories.removeAdjustInventory(adjustId);
  },

  async adjustInventoryRun(_root, { adjustId }: { adjustId: string }, { models, user }: IContext) {
    const adjustInventory = await models.AdjustInventories.getAdjustInventory(adjustId);

    const { beginDate, beforeAdjInv } = await checkValidDate(models, adjustInventory);

    await models.AdjustInventories.updateOne({ _id: adjustId }, { $set: { status: ADJ_INV_STATUSES.RUNNING, modifiedBy: user._id } });

    graphqlPubsub.publish(`accountingAdjustInventoryChanged:${adjustId}`, {
      accountingAdjustInventoryChanged: {
        ...adjustInventory,
        status: ADJ_INV_STATUSES.RUNNING,
        modifiedBy: user._id
      },
    });

    adjustRunning(models, user, { adjustInventory, beginDate, beforeAdjInv });

    return await models.AdjustInventories.getAdjustInventory(adjustId);
  }
};

export default adjustInventoryMutations;
