import { Schema } from 'mongoose';

import { mongooseField, schemaWrapper } from 'erxes-api-shared/utils';
import { BODY_TYPES, FUEL_TYPES, GEARBOX, STATUSES } from '../../constants';
import {
  customFieldSchema,
  attachmentSchema,
} from 'erxes-api-shared/core-modules';

export const carSchema = schemaWrapper(
  new Schema(
    {
      ownerId: { type: String, label: 'Owner' },
      plateNumber: { type: String, label: 'Plate number', index: true },
      vinNumber: { type: String, label: 'VIN number', index: true },
      colorCode: { type: String, label: 'colorCode' },
      categoryId: {
        type: String,
        label: 'Category',
        required: true,
        index: true,
      },
      bodyType: { type: String, label: 'Brand', enum: BODY_TYPES },
      fuelType: { type: String, label: 'Brand', enum: FUEL_TYPES },
      gearBox: { type: String, label: 'Gear box', enum: GEARBOX },
      vintageYear: { type: Number, label: 'Vintage year', required: true },
      imporYear: { type: Number, label: 'Imported year', required: true },
      status: { type: String, label: 'Status', enum: STATUSES, index: true },
      description: { type: String, label: 'Description' },
      tagIds: { type: [String], label: 'Tags' },
      mergedIds: { type: [String], label: 'Merged companies' },
      searchText: { type: String, index: true },
      attachment: {
        type: attachmentSchema,
        label: 'attachment',
      },
      customFieldsDays: {
        type: customFieldSchema,
        label: 'Custom fields data ',
      },
    },
    {
      timestamps: true,
    },
  ),
);
