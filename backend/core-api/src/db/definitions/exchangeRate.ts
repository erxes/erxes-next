import { stringRandomId } from 'erxes-api-utils';
import { Schema } from 'mongoose';

export const exchangeRateSchema = new Schema({
  _id: stringRandomId,
  date: { type: Date, label: 'Date', index: true },
  mainCurrency: { type: String, label: 'Main Currency' },
  rateCurrency: { type: String, label: 'Rate Currency' },
  rate: { type: Number, label: 'Rate' },
  createdAt: { type: Date, default: new Date(), label: 'Created at' },
  modifiedAt: { type: Date, optional: true, label: 'Modified at' },
});

exchangeRateSchema.index({ mainCurrency: 1, rateCurrency: 1, date: 1 });
