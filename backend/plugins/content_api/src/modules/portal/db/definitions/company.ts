import { Schema } from 'mongoose';

export const portalCompanySchema = new Schema({
  erxesCompanyId: { type: String },
  productCategoryIds: { type: [String] },
  clientPortalId: { type: String },
  createdAt: { type: Date, default: Date.now },
});
