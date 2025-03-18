import { Schema } from 'mongoose';
import { logicSchema } from './common';
import { stringRandomId } from 'erxes-api-utils';

export const fieldGroupSchema = new Schema({
  _id: stringRandomId,
  name: { type: String, label: 'Name' },
  // customer, company
  contentType: {
    type: String,
    label: 'Content type',
  },
  order: { type: Number, label: 'Order' },
  isDefinedByErxes: {
    type: Boolean,
    default: false,
    label: 'Is defined by erxes',
  },
  description: { type: String, label: 'Description' },
  parentId: { type: String, label: 'Parent Group ID', optional: true },
  code: {
    type: String,
    optional: true,
    label: 'Unique code',
  },
  // Id of user who updated the group
  lastUpdatedUserId: { type: String, label: 'Last updated by' },
  isMultiple: { type: Boolean, default: false, label: 'Is multple' },
  isVisible: { type: Boolean, default: true, label: 'Is visible' },
  isVisibleInDetail: {
    type: Boolean,
    default: true,
    label: 'Is group visible in detail',
  },
  alwaysOpen: {
    type: Boolean,
    default: false,
    label: 'Always open',
  },
  config: { type: Object },

  logics: { type: [logicSchema] },

  logicAction: {
    type: String,
    label:
      'If action is show field will appear when logics fulfilled, if action is hide it will disappear when logic fulfilled',
  },
});
