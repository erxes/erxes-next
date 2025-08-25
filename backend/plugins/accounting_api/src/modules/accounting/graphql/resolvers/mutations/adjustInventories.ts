import { getPureDate, graphqlPubsub } from 'erxes-api-shared/utils';
import { IModels, IContext } from '~/connectionResolvers';
import { IAdjustInventory, ADJ_INV_STATUSES } from '@/accounting/@types/adjustInventory';
import { TR_STATUSES } from '@/accounting/@types/constants';
import { adjustRunning } from '../../../utils/inventories';

const checkValidDate = async (models: IModels, adjustInventory: IAdjustInventory) => {
  const date = getPureDate(adjustInventory.date);
  const afterAdjInvs = await models.AdjustInventories.find({ date: { $gte: date }, status: ADJ_INV_STATUSES.PUBLISH }).lean();

  if (afterAdjInvs.length) {
    throw new Error('Үүнээс хойш батлагдсан тохируулга байгаа учир энэ огноонд тохируулга үүсгэх шаардлагагүй.');
  }

  const lowBeforeAdjInvs = await models.AdjustInventories.find({ date: { $lt: date }, status: { $ne: ADJ_INV_STATUSES.PUBLISH } }).lean();
  if (lowBeforeAdjInvs.length) {
    throw new Error('Энэнээс урагш дутуу гүйцэтгэлтэй тохируулга байна. Түүнийг устгах эсвэл гүйцээж байж энэ огноонд тохируулга үүсгэнэ үү.');
  }

  const beforeAdjInv = await models.AdjustInventories.findOne({ date: { $lt: date }, status: ADJ_INV_STATUSES.PUBLISH }).sort({ date: -1 }).lean();

  let beginDate = beforeAdjInv?.date;
  if (!beginDate) {
    const firstTr = await models.Transactions.findOne({ date: { $lte: date }, 'details.productId': { $exists: true, $ne: '' }, status: { $in: TR_STATUSES.ACTIVE } }).sort({ date: 1 }).lean();
    beginDate = firstTr?.date;
  }

  if (!beginDate) {
    throw new Error('ҮҮнээс урагш гүйлгээ ч алга, тохируулга ч алга. Тиймээс тохируулах шаардлагагүй.');
  }

  return { beginDate, beforeAdjInv };
}

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

  async adjustInventoryRemove(_root, { _id }: { _id: string }, { models }: IContext) {
    const adjusting = await models.AdjustInventories.getAdjustInventory(_id);
    if (adjusting.status === ADJ_INV_STATUSES.PUBLISH) {
      throw new Error('this adjusting is published');
    }
  },

  async adjustInventoryRun(_root, { adjustId }: { adjustId: string }, { models, user, subdomain }: IContext) {
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

    adjustRunning(models, adjustInventory, beginDate, beforeAdjInv);

    return await models.AdjustInventories.getAdjustInventory(adjustId);
  }
};

export default adjustInventoryMutations;
