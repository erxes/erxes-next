import { Schema } from 'mongoose';
import { field } from './utils';

// Mongoose schemas ===========

export const accountingConfigSchema = new Schema({
  _id: field({ pkey: true }),
  code: field({ type: String, unique: true }),
  value: field({ type: Object }),
});

// VAT_RULE: string; '' = bagtsan, 'add' = undsen unedeer nemj tootsoh,
// MainCurrency: string; main currency in country
// 
