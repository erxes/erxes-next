import { fieldQueries } from './field';
import { fieldsGroupQueries } from './fieldGroup';

export const propertyQueries = {
  ...fieldQueries,
  ...fieldsGroupQueries,
};
