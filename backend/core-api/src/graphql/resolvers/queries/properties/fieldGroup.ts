import { IContext } from 'backend/core-api/src/connectionResolvers';
import { getContentTypes } from 'backend/core-api/src/modules/properties/utils';

export const fieldsGroupQueries = {
  /**
   * Fields group list
   */
  async fieldsGroups(
    _root,
    {
      contentType,
      isDefinedByErxes,
      codes,
    }: {
      contentType: string;
      isDefinedByErxes: boolean;
      codes: string[];
    },
    { commonQuerySelector, models }: IContext,
  ) {
    const query: any = {
      $or: [{ ...commonQuerySelector }, { isDefinedByErxes: true }],
    };

    // querying by content type
    query.contentType = contentType;

    if (contentType) {
      const [serviceName, serviceType] = contentType.split(':');

      if (serviceType === 'all') {
        const contentTypes: Array<string> = await getContentTypes(serviceName);
        query.contentType = { $in: contentTypes };
      } else {
        query.contentType = contentType;
      }
    }

    if (isDefinedByErxes !== undefined) {
      query.isDefinedByErxes = isDefinedByErxes;
    }

    if (codes && codes.length > 0) {
      query.code = { $in: codes };
    }

    const groups = await models.FieldsGroups.find(query).sort({ order: 1 });
    return groups;
  },

  async getSystemFieldsGroup(
    _root,
    { contentType }: { contentType: string },
    { models }: IContext,
  ) {
    const query: any = {};

    // querying by content type
    query.contentType = contentType;
    query.isDefinedByErxes = true;

    return models.FieldsGroups.findOne(query);
  },
};
