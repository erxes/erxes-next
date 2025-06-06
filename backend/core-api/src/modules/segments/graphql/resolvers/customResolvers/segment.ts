// import { IContext } from "../../connectionResolver";
// import { ISegmentDocument } from "../../db/models/definitions/segments";
// import { fetchSegment } from "../modules/segments/queryBuilder";

import { IContext } from '~/connectionResolvers';
import { ISegmentDocument } from '~/modules/segments/db/definitions/segments';

export default {
  async __resolveReference({ _id }, { models }: IContext) {
    return models.Segments.findOne({ _id });
  },
  async getSubSegments(segment: ISegmentDocument, _args, { models }: IContext) {
    return models.Segments.find({
      subOf: { $in: [segment._id] },
    }).lean();
  },

  async count(
    segment: ISegmentDocument,
    _args,
    { models, subdomain }: IContext,
  ) {
    // const result = await fetchSegment(models, subdomain, segment, {
    //   returnCount: true
    // });
    // return result;
    return 0;
  },

  async subSegmentConditions(
    segment: ISegmentDocument,
    _args,
    { models }: IContext,
  ) {
    const segmentIds = segment.conditions.map((cond) => cond.subSegmentId);

    return models.Segments.aggregate([
      { $match: { _id: { $in: segmentIds } } },
      { $addFields: { __order: { $indexOfArray: [segmentIds, '$_id'] } } },
      { $sort: { __order: 1 } },
    ]);
  },
};
