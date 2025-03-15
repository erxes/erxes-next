import { stringRandomId } from 'erxes-api-utils';
import { Schema } from 'mongoose';

export const formSubmissionSchema = new Schema({
  _id: stringRandomId,
  customerId: { type: String, optional: true },
  userId: { type: String, optional: true },
  contentType: { type: String, optional: true },
  contentTypeId: { type: String, optional: true },
  value: { type: Object, optional: true },
  submittedAt: { type: Date, default: Date.now },
  formId: { type: String, optional: true },
  formFieldId: { type: String, optional: true },
  groupId: { type: String, optional: true },
});
