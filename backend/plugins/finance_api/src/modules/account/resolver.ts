import mongoose from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { IPlanModel, loadPlanClass } from '~/modules/plan/db/models/Plan';
import { IPlanDocument } from '~/modules/plan/types';

export interface IPlanModels {
  Plans: IPlanModel;
}

export const loadClass = (models: IModels, db: mongoose.Connection) => {
  models.Plans = db.model<IPlanDocument, IPlanModel>(
    'finance_accounts',
    loadPlanClass(models),
  );
};
