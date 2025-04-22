// import { fetchEs } from "@erxes/api-utils/src/elasticsearch";
// import {
//   gatherDependentServicesType,
//   ISegmentContentType
// } from "@erxes/api-utils/src/segments";
// import {
//   checkPermission,
//   requireLogin
// } from "@erxes/api-utils/src/permissions";

import { IContext } from '~/connectionResolvers';

// import { IContext } from "../../../connectionResolver";
// import { fetchSegment } from "../../modules/segments/queryBuilder";
// import {
//   getService,
//   getServices,
//   isEnabled
// } from "@erxes/api-utils/src/serviceDiscovery";

interface IPreviewParams {
  contentType: string;
  conditions;
  subOf?: string;
  config: any;
  conditionsConjunction?: 'and' | 'or';
}

interface IAssociatedType {
  type: string;
  description: string;
}

const segmentQueries = {
  async segmentsGetTypes() {
    // const serviceNames = await getServices();
    // let types: Array<{ name: string; description: string }> = [];
    // for (const serviceName of serviceNames) {
    //   const service = await getService(serviceName);
    //   const meta = service.config.meta || {};
    //   if (meta.segments) {
    //     const serviceTypes = (meta.segments.contentTypes || []).flatMap(
    //       (ct: ISegmentContentType) => {
    //         if (ct.hideInSidebar) {
    //           return [];
    //         }
    //         return {
    //           contentType: `${serviceName}:${ct.type}`,
    //           description: ct.description
    //         };
    //       }
    //     );
    //     types = [...types, ...serviceTypes];
    //   }
    // }
    // return types;
  },

  async segmentsGetAssociationTypes(_root, { contentType }) {
    // const [serviceName] = contentType.split(":");
    // const service = await getService(serviceName);
    // const meta = service.config.meta || {};
    // if (!meta.segments) {
    //   return [];
    // }
    // // get current services content types
    // const serviceCts = meta.segments.contentTypes || [];
    // const associatedTypes: IAssociatedType[] = serviceCts.map(
    //   (ct: ISegmentContentType) => ({
    //     type: `${serviceName}:${ct.type}`,
    //     description: ct.description
    //   })
    // );
    // // gather dependent services contentTypes
    // const dependentServices = meta.segments.dependentServices || [];
    // for (const dService of dependentServices) {
    //   if (!(await isEnabled(dService.name))) {
    //     continue;
    //   }
    //   const depService = await getService(dService.name);
    //   const depServiceMeta = depService.config.meta || {};
    //   if (depServiceMeta.segments) {
    //     let contentTypes = depServiceMeta.segments.contentTypes || [];
    //     if (!!dService?.types?.length) {
    //       contentTypes = contentTypes.filter(({ type }) =>
    //         (dService?.types || []).includes(type)
    //       );
    //     }
    //     contentTypes = contentTypes;
    //     contentTypes.forEach((ct: ISegmentContentType) => {
    //       associatedTypes.push({
    //         type: `${dService.name}:${ct.type}`,
    //         description: ct.description
    //       });
    //     });
    //   }
    // }
    // // gather contentTypes of services that are dependent on current service
    // await gatherDependentServicesType(
    //   serviceName,
    //   (ct: ISegmentContentType, sName: string) => {
    //     associatedTypes.push({
    //       type: `${sName}:${ct.type}`,
    //       description: ct.description
    //     });
    //   }
    // );
    // return associatedTypes.map(atype => ({
    //   value: atype.type,
    //   description: atype.description
    // }));
  },

  /**
   * Segments list
   */
  async segments(
    _root,
    {
      contentTypes,
      config,
      ids,
    }: { contentTypes: string[]; config?: any; ids: string[] },
    { models, commonQuerySelector }: IContext,
  ) {
    const selector: any = {
      ...commonQuerySelector,
      contentType: { $in: contentTypes },
      name: { $exists: true },
    };

    if (ids) {
      selector._id = { $in: ids };
    }

    if (config) {
      for (const key of Object.keys(config)) {
        selector[`config.${key}`] = config[key];
      }
    }

    return models.Segments.find(selector).sort({ name: 1 });
  },

  /**
   * Only segment that has no sub segments
   */
  async segmentsGetHeads(
    _root,
    { contentType },
    { models, commonQuerySelector }: IContext,
  ) {
    let selector: any = {};

    if (contentType) {
      selector.contentType = contentType;
    }
    return models.Segments.find({
      ...commonQuerySelector,
      ...selector,
      name: { $exists: true },
      $or: [{ subOf: { $exists: false } }, { subOf: '' }],
    });
  },

  /**
   * Get one segment
   */
  async segmentDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.Segments.findOne({ _id });
  },

  /**
   * Preview count
   */
  async segmentsPreviewCount(
    _root,
    {
      contentType,
      conditions,
      subOf,
      config,
      conditionsConjunction,
    }: IPreviewParams,
    { models, subdomain }: IContext,
  ) {
    // return fetchSegment(
    //   models,
    //   subdomain,
    //   {
    //     name: "preview",
    //     color: "#fff",
    //     subOf: subOf || "",
    //     config,
    //     contentType,
    //     conditions,
    //     conditionsConjunction
    //   },
    //   { returnCount: true }
    // );
    return;
  },
};

// requireLogin(segmentQueries, "segmentsGetHeads");
// requireLogin(segmentQueries, "segmentDetail");
// requireLogin(segmentQueries, "segmentsPreviewCount");
// requireLogin(segmentQueries, "segmentsEvents");

// checkPermission(segmentQueries, "segments", "showSegments", []);

export { segmentQueries };
