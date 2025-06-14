import { mongooseStringRandomId } from 'erxes-api-shared/src/utils';
import { Schema } from 'mongoose';

export const portalCompanySchema = new Schema({
  _id: mongooseStringRandomId,
  erxesCompanyId: { type: String },
  productCategoryIds: { type: [String] },
  clientPortalId: { type: String },
  createdAt: { type: Date, default: Date.now },
});
