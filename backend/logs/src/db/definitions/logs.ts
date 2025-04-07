import { Schema, Document } from "mongoose";

export interface ILog {
  createdAt: Date;
  userId?: string;
  status: string;
  payload?: any;
  action?: string;
  docId?: string;
  source: string;
}

export interface ILogDocument extends Document, ILog {
  _id: string;
}

export const logsSchema = new Schema({
  source: { type: String, label: "Source" },
  status: { type: String, enum: ["success", "failed"], required: true },
  createdAt: { type: Date, label: "Created At", default: new Date() },
  userId: { type: String, label: "User Id" },
  docId: { type: String, optional: true },
  payload: { type: Schema.Types.Mixed },
  action: { type: String, label: "action", optional: true },
}).index({
  createdAt: -1,
  status: 1,
  userId: 1,
  action: "text",
  source: "text",
  docId: 1,
});
