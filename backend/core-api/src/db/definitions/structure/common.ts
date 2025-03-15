import { stringRandomId } from 'erxes-api-utils';
import { attachmentSchema, CoordinateSchame } from '../common';

export const commonSchemaFields = {
  _id: stringRandomId,
  title: { type: String },
  code: { type: String, unique: true },
  updatedBy: { type: String },
  createdBy: { type: String },
};

export const contactInfoSchema = {
  website: { type: String, optional: true },
  phoneNumber: { type: String, optional: true },
  email: { type: String, optional: true },
  address: { type: String, optional: true },
  links: { type: Object, default: {}, label: 'Links' },
  coordinate: {
    type: CoordinateSchame,
    optional: true,
    label: 'Longitude and latitude',
  },
  image: { type: attachmentSchema, optional: true },
};
