import { IContext } from 'backend/core-api/src/connectionResolvers';
import {
  IFieldGroup,
  IFieldGroupDocument,
} from '../../../../modules/properties/@types';

export const fieldsGroupsMutations = {
  /**
   * Create a new group for fields
   */
  async fieldsGroupsAdd(
    _root,
    doc: IFieldGroup,
    { user, docModifier, models }: IContext,
  ) {
    const fieldGroup = await models.FieldsGroups.createGroup(
      docModifier({ ...doc, lastUpdatedUserId: user._id }),
    );

    return fieldGroup;
  },

  /**
   * Update group for fields
   */
  async fieldsGroupsEdit(
    _root,
    { _id, ...doc }: IFieldGroupDocument,
    { user, models }: IContext,
  ) {
    return models.FieldsGroups.updateGroup(_id, {
      ...doc,
      lastUpdatedUserId: user._id,
    });
  },

  /**
   * Remove group
   */
  async fieldsGroupsRemove(
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.FieldsGroups.removeGroup(_id);
  },
};
