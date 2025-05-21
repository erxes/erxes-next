import { checkPermission } from 'erxes-api-shared/core-modules';
import {
  cursorPaginate,
  getPlugin,
  getPlugins,
  sendTRPCMessage,
} from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { IDocumentDocument, IDocumentFilterQueryParams } from '../types';

const generateFilter = (params: IDocumentFilterQueryParams) => {
  const { searchValue, contentType, subType } = params;

  const filter: any = {};

  if (contentType) {
    filter.contentType = contentType;
  }

  if (subType) {
    filter.$or = [
      { subType },
      { subType: { $exists: false } },
      { subType: { $in: ['', null, undefined] } },
    ];
  }

  if (searchValue) {
    filter.name = new RegExp(`.*${searchValue}.*`, 'i');
  }

  return filter;
};

export const documentQueries = {
  documents: async (
    _parent: undefined,
    params: IDocumentFilterQueryParams,
    { models }: IContext,
  ) => {
    const filter = generateFilter(params);

    const { list, pageInfo, totalCount } =
      await cursorPaginate<IDocumentDocument>({
        model: models.Documents,
        params,
        query: filter,
      });

    return { list, pageInfo, totalCount };
  },

  documentsDetail: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    return models.Documents.findOne({ _id });
  },

  documentsGetContentTypes: async () => {
    const services = await getPlugins();

    const fieldTypes: Array<{
      label: string;
      contentType: string;
      subTypes?: string[];
      // }> = [...common.types];
    }> = [];

    for (const serviceName of services) {
      const service = await getPlugin(serviceName);
      const meta = service.config.meta || {};
      if (meta && meta.documents) {
        const types = meta.documents.types || [];

        for (const type of types) {
          fieldTypes.push({
            label: type.label,
            contentType: `${type.type}`,
            subTypes: type.subTypes,
          });
        }
      }
    }

    return fieldTypes;
  },

  documentsGetEditorAttributes: async (
    _parent: undefined,
    { contentType }: { contentType: string },
    { subdomain }: IContext,
  ) => {
    const [serviceName, type] = contentType.split(':');

    // const editorAttributes = common.editorAttributes[type];

    // if (editorAttributes) {
    //   return await editorAttributes({ subdomain, data: { contentType } });
    // }

    return await sendTRPCMessage({
      pluginName: serviceName,
      method: 'query',
      module: 'documents',
      action: 'editorAttributes',
      input: {
        contentType,
      },
      defaultValue: [],
    });
  },

  documentsTotalCount: async (
    _parent: undefined,
    params: IDocumentFilterQueryParams,
    { models }: IContext,
  ) => {
    const filter = generateFilter(params);

    return models.Documents.find(filter).countDocuments();
  },
};

checkPermission(documentQueries, 'documents', 'showDocuments');
