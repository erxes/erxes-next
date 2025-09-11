import { Schema } from 'mongoose';
import { ICallCustomer } from '~/modules/integrations/call/@types/customers';
import { ICallCustomerModel } from '~/modules/integrations/call/db/models/Customers';

export const customerSchema: Schema<ICallCustomer, ICallCustomerModel> =
  new Schema<ICallCustomer, ICallCustomerModel>({
    erxesApiId: { type: String, label: 'Customer id at contacts-api' },
    primaryPhone: {
      type: String,
      unique: true,
      label: 'Call primary phone',
    },
    inboxIntegrationId: { type: String, label: 'Inbox integration id' },
    status: { type: String, label: 'status' },
  });
