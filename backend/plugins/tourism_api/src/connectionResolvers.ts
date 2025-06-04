import { IMainContext } from 'erxes-api-shared/core-types';
import { createGenerateModels } from 'erxes-api-shared/utils';

import mongoose from 'mongoose';
import {
  IElementCategoryModel,
  IElementModel,
  loadElementCategoryClass,
  loadElementClass,
} from '@/bms/db/models/Element';
import { IItineraryModel, loadItineraryClass } from '@/bms/db/models/Itinerary';
import { ITourModel, loadTourClass } from '@/bms/db/models/Tour';
import { IOrderModel, loadOrderClass } from '@/bms/db/models/Order';
import { IBranchModel, loadBranchClass } from '@/bms/db/models/Branch';
import { IElementCategoryDocument } from '@/bms/@types/element';
import { IItineraryDocument } from '@/bms/@types/itinerary';
import { ITourDocument } from '@/bms/@types/tour';
import { IOrderDocument } from '@/bms/@types/order';
import { IBranchDocument } from '@/bms/@types/branch';

export interface IModels {
  Elements: IElementModel;
  ElementCategories: IElementCategoryModel;
  Itineraries: IItineraryModel;
  Tours: ITourModel;
  Orders: IOrderModel;
  Branches: IBranchModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export const loadClasses = (
  db: mongoose.Connection,
  subdomain: string,
): IModels => {
  const models = {} as IModels;

  models.Elements = db.model<IElementModel, IElementModel>(
    'bm_elements',
    loadElementClass(models, subdomain),
  );

  models.ElementCategories = db.model<
    IElementCategoryDocument,
    IElementCategoryModel
  >('bm_element_categories', loadElementCategoryClass(models, subdomain));

  models.Itineraries = db.model<IItineraryDocument, IItineraryModel>(
    'bm_itinerary',
    loadItineraryClass(models, subdomain),
  );

  models.Tours = db.model<ITourDocument, ITourModel>(
    'bm_tours',
    loadTourClass(models, subdomain),
  );

  models.Orders = db.model<IOrderDocument, IOrderModel>(
    'bm_orders',
    loadOrderClass(models, subdomain),
  );

  models.Branches = db.model<IBranchDocument, IBranchModel>(
    'bm_branch',
    loadBranchClass(models, subdomain),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
