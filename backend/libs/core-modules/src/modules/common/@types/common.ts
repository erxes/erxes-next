import { Schema } from 'mongoose';
export interface IBrowserInfo {
  language?: string;
  url?: string;
  city?: string;
  countryCode?: string;
}

export interface IRule {
  kind: string;
  text: string;
  condition: string;
  value: string;
}



export interface IRuleDocument extends IRule, Document {
  _id: string;
}

export interface ICustomField {
  field: string;
  value: any;
  stringValue?: string;
  numberValue?: number;
  dateValue?: Date;
}

export interface IBrandEmailConfig {
  type?: string;
  template?: string;
}

export interface IBrandEmailConfigDocument
  extends IBrandEmailConfig,
    Document {}


    export const customFieldSchema = new Schema(
      {
        field: { type: String },
        value: { type: Schema.Types.Mixed },
        stringValue: { type: String, optional: true },
        numberValue: { type: Number, optional: true },
        dateValue: { type: Date, optional: true },
        locationValue: {
          type: {
            type: String,
            enum: ['Point'],
            optional: true
          },
          coordinates: {
            type: [Number],
            optional: true
          }
        }
      },
      { _id: false }
    );
    
    customFieldSchema.index({ locationValue: '2dsphere' });