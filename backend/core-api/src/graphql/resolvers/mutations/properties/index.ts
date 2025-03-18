import { fieldMutations } from './field';
import { fieldsGroupsMutations } from './fieldGroup';

export const propertyMutations = {
  ...fieldMutations,
  ...fieldsGroupsMutations,
};
