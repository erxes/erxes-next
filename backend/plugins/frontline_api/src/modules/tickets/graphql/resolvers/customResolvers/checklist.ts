import { IContext } from '~/connectionResolvers';
import { IChecklistDocument } from '~/modules/tickets/@types/checklist';

export default {
  async items(
    checklist: IChecklistDocument,
    _args: undefined,
    { models }: IContext,
  ) {
    return models.CheckListItems.find({ checklistId: checklist._id }).sort({
      order: 1,
    });
  },

  async percent(
    checklist: IChecklistDocument,
    _args: undefined,
    { models }: IContext,
  ) {
    const items = await models.CheckListItems.find({
      checklistId: checklist._id,
    });

    if (items.length === 0) {
      return 0;
    }

    const checkedItems = items.filter((item) => {
      return item.isChecked;
    });

    return (checkedItems.length / items.length) * 100;
  },
};
