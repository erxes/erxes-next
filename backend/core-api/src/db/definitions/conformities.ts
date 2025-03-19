import { stringRandomId } from 'erxes-api-utils';
import { Schema } from 'mongoose';

export const conformitySchema = new Schema({
  _id: stringRandomId,
  mainType: { type: String },
  mainTypeId: { type: String, index: true },
  relType: { type: String },
  relTypeId: { type: String, index: true },
});

conformitySchema.index({
  mainType: 1,
  mainTypeId: 1,
  relType: 1,
  relTypeId: 1,
});
conformitySchema.index({ relType: 1, relTypeId: 1, mainType: 1 });
conformitySchema.index({ mainType: 1, relTypeId: 1 });
conformitySchema.index({ relType: 1, mainTypeId: 1 });
