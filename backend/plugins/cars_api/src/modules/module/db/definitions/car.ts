import { Schema } from 'mongoose';

import { schemaWrapper } from 'erxes-api-shared/utils';
import { BODY_TYPES, FUEL_TYPES, GEARBOX, STATUSES } from '../../constants';
import {
  customFieldSchema,
  attachmentSchema,
} from 'erxes-api-shared/core-modules';

export const carSchema = schemaWrapper(
  new Schema(
    {
      ownerId: { type: String, label: 'ownerId' },
      plateNumber: { type: String, label: 'plateNumber', index: true },
      vinNumber: { type: String, label: 'vinNumber', index: true },
      colorCode: { type: String, label: 'colorCode' },
      categoryId: {
        type: String,
        label: 'categoryId',
        required: true,
        index: true,
      },
      bodyType: { type: String, label: 'bodyType', enum: BODY_TYPES },
      fuelType: { type: String, label: 'fuelType', enum: FUEL_TYPES },
      gearBox: { type: String, label: 'gearBox', enum: GEARBOX },
      vintageYear: { type: Number, label: 'vintageYear', required: true },
      imporYear: { type: Number, label: 'imporYear', required: true },
      status: { type: String, label: 'status', enum: STATUSES, index: true },
      description: { type: String, label: 'description' },
      tagIds: { type: [String], label: 'tagIds' },
      mergedIds: { type: [String], label: 'mergedIds' },
      searchText: { type: String, label: 'searchText', index: true },
      attachment: {
        type: attachmentSchema,
        label: 'attachment',
      },
      customFieldsDays: { type: customFieldSchema, label: 'customDays' },
    },
    {
      timestamps: true,
    },
  ),
);
