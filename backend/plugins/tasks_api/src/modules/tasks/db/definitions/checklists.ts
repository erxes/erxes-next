import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';

export const checklistSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    checklistId: { type: String, label: 'Checklist', index: true },
    content: { type: String, label: 'Content' },
    isChecked: { type: Boolean, label: 'Is checked' },
    userId: { type: String, label: 'Created by' },
    order: { type: Number },
  },
  {
    timestamps: true,
  },
);

export const checklistDocumentSchema = new Schema(
    {
      _id: mongooseStringRandomId,
      checklistId: { type: String, label: 'Checklist Document', index: true },
      content: { type: String, label: 'Content' },
      isChecked: { type: Boolean, label: 'Is checked' },
      userId: { type: String, label: 'Created by' },
      order: { type: Number },
    },
    {
      timestamps: true,
    },
  );
  
export const checklistItemSchema = new Schema(
    {
      _id: mongooseStringRandomId,
      checklistId: { type: String, label: 'Checklist Item', index: true },
      content: { type: String, label: 'Content' },
      isChecked: { type: Boolean, label: 'Is checked' },
      userId: { type: String, label: 'Created by' },
      order: { type: Number },
    },
    {
      timestamps: true,
    },
  );
  
export const checklistItemDocumentSchema = new Schema(
      {
        _id: mongooseStringRandomId,
        checklistId: { type: String, label: 'Checklist Item Document', index: true },
        content: { type: String, label: 'Content' },
        isChecked: { type: Boolean, label: 'Is checked' },
        userId: { type: String, label: 'Created by' },
        order: { type: Number },
      },
      {
        timestamps: true,
      },
    );






