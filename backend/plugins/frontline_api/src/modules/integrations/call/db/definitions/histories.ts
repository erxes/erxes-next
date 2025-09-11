import { Schema } from 'mongoose';

export const callHistorySchema = new Schema({
  operatorPhone: { type: String, label: 'operator number' },
  customerPhone: { type: String, label: 'customer number' },
  callDuration: { type: Number, label: 'duration' },
  callStartTime: { type: Date, label: 'call start time' },
  callEndTime: { type: Date, label: 'call end time' },
  callType: {
    type: String,
    label: 'call type',
    // enum: ['incoming', 'outgoing'],
  },
  callStatus: {
    type: String,
    label: 'status',
    enum: [
      'missed',
      'connected',
      'rejected',
      'cancelled',
      'active',
      'transferred',
      'cancelledToAnswered',
    ],
    default: 'missed',
  },
  acceptedUserId: {
    type: String,
    label: 'call accepted operator id',
  },
  timeStamp: {
    type: Number,
    label: 'call timestamp',
  },
  modifiedAt: { type: Date, label: 'modified date' },
  createdAt: { type: Date, label: 'created date', default: new Date() },
  createdBy: { type: String, label: 'created By' },
  modifiedBy: { type: String, label: 'updated By' },
  extensionNumber: { type: String, label: 'extention number' },
  conversationId: { type: String, label: 'erxes conversation id' },
  inboxIntegrationId: { type: String, label: 'erxes integration id' },
  recordUrl: { type: String, label: 'record url' },
  endedBy: {
    type: String,
    label: `'Local' indicates the call was ended by Erxes, while 'remote' indicates the call was ended by the customer`,
  },
  queueName: { type: String, label: 'queue name' },
});
