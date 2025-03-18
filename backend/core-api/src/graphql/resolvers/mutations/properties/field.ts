import { IContext } from 'backend/core-api/src/connectionResolvers';
import { IField, IFieldDocument } from '../../../../modules/properties/@types';

export const fieldMutations = {
  /**
   * Adds field object
   */
  async fieldsAdd(_root, args: IField, { user, models }: IContext) {
    const field = await models.Fields.createField({
      ...args,
      lastUpdatedUserId: user._id,
    });

    return field;
  },

  /**
   * Updates field object
   */
  async fieldsEdit(
    _root,
    { _id, ...doc }: IFieldDocument,
    { user, models }: IContext,
  ) {
    return models.Fields.updateField(_id, {
      ...doc,
      lastUpdatedUserId: user._id,
    });
  },

  /**
   * Remove a channel
   */
  async fieldsRemove(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.Fields.removeField(_id);
  },
};
