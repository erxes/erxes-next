import { SchemaTypeOptions, Schema } from 'mongoose';

export interface IFieldOptions {
  type: any;
  label?: string;
  optional?: boolean;
  default?: any;
  unique?: boolean;
  enum?: any[];
  min?: number;
  max?: number;
  minlength?: number;
  maxlength?: number;
  match?: RegExp;
  validate?: any;
  get?: (value: any) => any;
  set?: (value: any) => any;
  alias?: string;
  immutable?: boolean;
  transform?: (value: any) => any;
}

export const field = (options: IFieldOptions): SchemaTypeOptions<any> => {
  const fieldOptions: SchemaTypeOptions<any> = {
    type: options.type,
    required: !options.optional,
    default: options.default,
    unique: options.unique || false,
    enum: options.enum,
    min: options.min,
    max: options.max,
    minlength: options.minlength,
    maxlength: options.maxlength,
    match: options.match,
    validate: options.validate,
    get: options.get,
    set: options.set,
    alias: options.alias,
    immutable: options.immutable,
    transform: options.transform,
  };

  // Remove undefined properties
  Object.keys(fieldOptions).forEach(
    (key) => fieldOptions[key as keyof SchemaTypeOptions<any>] === undefined && 
             delete fieldOptions[key as keyof SchemaTypeOptions<any>]
  );

  return fieldOptions;
};

// Common field types for reuse
export const stringField = (options: Omit<IFieldOptions, 'type'> = {}) => 
  field({ type: String, ...options });

export const numberField = (options: Omit<IFieldOptions, 'type'> = {}) => 
  field({ type: Number, ...options });

export const dateField = (options: Omit<IFieldOptions, 'type'> = {}) => 
  field({ type: Date, ...options });

export const booleanField = (options: Omit<IFieldOptions, 'type'> = {}) => 
  field({ type: Boolean, ...options });

export const arrayField = (options: Omit<IFieldOptions, 'type'> = {}) => 
  field({ type: Array, ...options });

export const objectField = (options: Omit<IFieldOptions, 'type'> = {}) => 
  field({ type: Object, ...options });

export const bufferField = (options: Omit<IFieldOptions, 'type'> = {}) => 
  field({ type: Buffer, ...options });

// Relationship field helpers
export const refField = (ref: string, options: Omit<IFieldOptions, 'type'> = {}) => 
  field({ 
    type: Schema.Types.ObjectId, 
    ref, 
    ...options 
  } as IFieldOptions);

export const refArrayField = (ref: string, options: Omit<IFieldOptions, 'type'> = {}) => 
  field({ 
    type: [Schema.Types.ObjectId], 
    ref, 
    ...options 
  } as IFieldOptions);