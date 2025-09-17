import { IUserDocument } from 'erxes-api-shared/core-types';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { planSchema } from '~/modules/plan/db/definitions/plan';
import { IPlan, IPlanDocument } from '~/modules/plan/types';

export interface IPlanModel extends Model<IPlanDocument> {
  getPlan(_id: string): Promise<IPlanDocument>;
  createPlan(doc: IPlan, user: IUserDocument): Promise<IPlanDocument>;
  updatePlan(
    _id: string,
    doc: IPlan,
    user: IUserDocument,
  ): Promise<IPlanDocument>;
  removePlan(_id: string, user: IUserDocument): Promise<IPlanDocument>;
}

export const loadPlanClass = (models: IModels) => {
  class Plan {
    public static async getPlan(_id: string) {
      const plan = await models.Plans.findOne({ _id });

      if (!plan) {
        throw new Error('Plan doesn’t exist!');
      }

      return plan;
    }

    public static async createPlan(doc: IPlan, user: IUserDocument) {
      this.validatePlan({ doc, user });

      return models.Plans.create({
        ...doc,
        createdBy: user._id || '',
      });
    }

    public static async updatePlan(
      _id: string,
      doc: IPlan,
      user: IUserDocument,
    ) {
      this.validatePlan({ _id, doc, user });

      return models.Plans.findOneAndUpdate(
        { _id },
        {
          ...doc,
          updatedBy: user._id || '',
        },
        { new: true },
      );
    }

    public static async removePlan(_id: string, user: IUserDocument) {
      this.validatePlan({ _id, user });

      return models.Plans.findOneAndDelete({ _id });
    }

    public static async validatePlan({
      _id,
      doc,
      user,
    }: {
      _id?: string;
      doc?: IPlan;
      user: IUserDocument;
    }) {}
  }

  planSchema.loadClass(Plan);

  return planSchema;
};
