import { mongooseStringRandomId } from "erxes-api-shared/utils";
import { Schema } from 'mongoose';

export const pipelineTemplateSchema = new Schema(
 {    _id: mongooseStringRandomId,
    name: { type: String, label: 'Name' },
    userId: { type: String, label: 'Created by' },
    order: { type: Number, label: 'Order' },
    type: {
      type: String,
      required: true,
      label: 'Type',
      default: 'deal',
    },
    formId: { type: String, label: 'Board ID'},

},
{
    timestamps: true,
},

)

export const pipelineTemplateStageSchema = new Schema(
  {    _id: mongooseStringRandomId,
     name: { type: String, label: 'Name' },
     userId: { type: String, label: 'Created by' },
     order: { type: Number, label: 'Order' },
     type: {
       type: String,
       required: true,
       label: 'Type',
       default: 'deal',
     },
     formId: { type: String, label: 'Board ID'},
 
 },
 {
     timestamps: true,
 },
 
 )