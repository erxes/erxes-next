import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import {
  IPipelineLabel,
  IPipelineLabelDocument,
} from '~/modules/tasks/@types/labels';
import { pipelineLabelSchema } from '~/modules/tasks/db/definitions/labels';

interface IFilter extends IPipelineLabel {
  _id?: any;
}

export interface IPipelineLabelModel extends Model<IPipelineLabelDocument> {
  getPipelineLabel(_id: string): Promise<IPipelineLabelDocument>;
  createPipelineLabel(doc: IPipelineLabel): Promise<IPipelineLabelDocument>;
  updatePipelineLabel(
    _id: string,
    doc: IPipelineLabel,
  ): Promise<IPipelineLabelDocument>;
  removePipelineLabel(_id: string): void;
  validateUniqueness(filter: IFilter, _id?: string): Promise<boolean>;
  labelObject(params: { labelIds: string[]; targetId: string }): void;
  labelsLabel(targetId: string, labelIds: string[]): void;
}

export const loadPipelineLabelClass = (models: IModels) => {
  class PipelineLabel {
    /*
     * Get a pipeline label
     */
    public static async getPipelineLabel(_id: string) {
      const pipelineLabel = await models.PipelineLabels.findOne({ _id });

      if (!pipelineLabel) {
        throw new Error('Label not found');
      }

      return pipelineLabel;
    }

    /**
     * Create a pipeline label
     */
    public static async createPipelineLabel(doc: IPipelineLabel) {
      const filter: IFilter = {
        name: doc.name,
        pipelineId: doc.pipelineId,
        colorCode: doc.colorCode,
      };

      const isUnique = await models.PipelineLabels.validateUniqueness(filter);

      if (!isUnique) {
        throw new Error('Label duplicated');
      }

      return models.PipelineLabels.create(doc);
    }

    /**
     * Update pipeline label
     */
    public static async updatePipelineLabel(_id: string, doc: IPipelineLabel) {
      const isUnique = await models.PipelineLabels.validateUniqueness(
        { ...doc },
        _id,
      );

      if (!isUnique) {
        throw new Error('Label duplicated');
      }

      return await models.PipelineLabels.findOneAndUpdate(
        { _id },
        { $set: doc },
        { new: true },
      );
    }

    /**
     * Remove pipeline label
     */
    public static async removePipelineLabel(_id: string) {
      const pipelineLabel = await models.PipelineLabels.findOne({ _id });

      if (!pipelineLabel) {
        throw new Error('Label not found');
      }

      // delete labelId from collection that used labelId
      await models.Tasks.updateMany(
        { labelIds: { $in: [pipelineLabel._id] } },
        { $pull: { labelIds: pipelineLabel._id } },
      );

      return models.PipelineLabels.findOneAndDelete({ _id });
    }

    /*
     * Validates label uniquness
     */
    public static async validateUniqueness(
      filter: IFilter,
      _id?: string,
    ): Promise<boolean> {
      if (_id) {
        filter._id = { $ne: _id };
      }

      if (await models.PipelineLabels.findOne(filter)) {
        return false;
      }

      return true;
    }

    /*
     * Common helper for objects like deal, task and growth hack etc ...
     */
    public static async labelObject({
      labelIds,
      targetId,
    }: {
      labelIds: string[];
      targetId: string;
    }) {
      const prevLabelsCount = await models.PipelineLabels.find({
        _id: { $in: labelIds },
      }).countDocuments();

      if (prevLabelsCount !== labelIds.length) {
        throw new Error('Label not found');
      }

      await models.Tasks.findOneAndUpdate(
        { _id: targetId },
        { $set: { labelIds } },
        { new: true },
      );
    }

    /**
     * Attach a label
     */
    public static async labelsLabel(targetId: string, labelIds: string[]) {
      await models.PipelineLabels.labelObject({
        labelIds,
        targetId,
      });
    }
  }

  pipelineLabelSchema.loadClass(PipelineLabel);

  return pipelineLabelSchema;
};
