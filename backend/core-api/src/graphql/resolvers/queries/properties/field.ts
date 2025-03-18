import { IContext } from 'backend/core-api/src/connectionResolvers';
import { IFieldsQuery } from '../../../../modules/properties/@types';
import { getService, getServices } from 'erxes-api-utils';
import { getContentTypes } from '../../../../modules/properties/utils';

export const fieldQueries = {
  async fieldsGetTypes() {
    const services = await getServices();
    const fieldTypes: Array<{ description: string; contentType: string }> = [];

    for (const serviceName of services) {
      const service = await getService(serviceName);
      const meta = service.config?.meta || {};

      if (meta?.forms) {
        const types = meta.forms.types || [];

        for (const type of types) {
          fieldTypes.push({
            description: type.description,
            contentType: `${serviceName}:${type.type}`,
          });
        }
      }
    }

    return fieldTypes;
  },

  /**
   * Fields list
   */
  async fields(
    _root,
    {
      contentType,
      contentTypeId,
      isVisible,
      isVisibleToCreate,
      searchable,
      pipelineId,
      groupIds: inputGroupIds,
      isDefinedByErxes,
    }: {
      contentType: string;
      contentTypeId: string;
      isVisible: boolean;
      isVisibleToCreate: boolean;
      searchable: boolean;
      pipelineId: string;
      groupIds: string[];
      isDefinedByErxes: boolean;
    },
    { models }: IContext,
  ) {
    const query: IFieldsQuery = { contentType };

    if (contentType) {
      const [serviceName, serviceType] = contentType.split(':');

      if (serviceType === 'all') {
        const contentTypes: Array<string> = await getContentTypes(serviceName);
        query.contentType = { $in: contentTypes } as any;
      } else {
        query.contentType = contentType;
      }
    }

    if (contentTypeId) {
      query.contentTypeId = contentTypeId;
    }

    if (isVisible) {
      query.isVisible = isVisible;
    }

    if (searchable !== undefined) {
      query.searchable = searchable;
    }

    const groupIds: string[] = [];

    if (inputGroupIds && inputGroupIds.length > 0) {
      groupIds.push(...inputGroupIds);
    }

    if (isVisibleToCreate !== undefined) {
      query.isVisibleToCreate = isVisibleToCreate;

      const erxesDefinedGroup = await models.FieldsGroups.findOne({
        contentType,
        isDefinedByErxes: true,
        code: { $exists: false },
      });

      if (erxesDefinedGroup) {
        groupIds.push(erxesDefinedGroup._id);
      }
    }

    if (isDefinedByErxes) {
      query.isDefinedByErxes = isDefinedByErxes;
    }

    if (pipelineId) {
      const otherGroupIds = await models.FieldsGroups.find({
        'config.boardsPipelines.pipelineIds': { $in: [pipelineId] },
      })
        .select({ _id: 1 })
        .sort({ order: 1 });

      const allFields: any[] = [];

      const fields = await models.Fields.find({
        ...query,
        groupId: { $in: groupIds },
      }).sort({ order: 1 });

      allFields.push(...fields);

      for (const groupId of otherGroupIds) {
        const groupFields = await models.Fields.find({
          groupId,
          ...query,
        }).sort({ order: 1 });

        allFields.push(...groupFields);
      }

      return allFields;
    }

    if (groupIds && groupIds.length > 0) {
      query.groupId = { $in: groupIds };
    }

    return models.Fields.find(query).sort({ order: 1 });
  },

  async fieldsGetDetail(_root, { _id, code }, { models }: IContext) {
    let field = await models.Fields.findOne({ code });

    if (!field) {
      field = await models.Fields.findOne({ _id });
    }

    return field;
  },

  async fieldByCode(
    _root,
    { contentType, code }: { contentType: string; code: string },
    { models }: IContext,
  ) {
    return models.Fields.findOne({ contentType, code });
  },
};
