import { Schema } from 'mongoose';
import { field, schemaWrapper } from './utils';

export const accountSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),

  }),
);
