import { Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export const mongooseField = (options: any) => {
  const { pkey, type, optional } = options;

  if (type === String && !pkey && !optional) {
    options.validate = /\S+/;
  }

  if (pkey) {
    options.type = String;
    options.default = () => nanoid();
  }

  return options;
};

export const mongooseSchemaWrapper = (schema: Schema) => {
  schema.add({ scopeBrandIds: [String] });

  return schema;
};
