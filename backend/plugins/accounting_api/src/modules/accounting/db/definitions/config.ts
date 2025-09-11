import { Schema } from 'mongoose';

// Mongoose schemas ===========

export const accountingConfigSchema = new Schema({
  code: { type: String, unique: true },
  value: { type: Object },
});

// VAT_RULE: string; '' = bagtsan, 'add' = undsen unedeer nemj tootsoh,
// MainCurrency: string; main currency in country
//
