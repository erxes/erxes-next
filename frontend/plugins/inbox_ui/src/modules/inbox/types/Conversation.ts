import { IAttachment } from 'erxes-ui';
import { ICustomerInline } from 'ui-modules';
import { IFormWidgetItem } from './FormWidget';

export interface IConversation {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  customer?: ICustomerInline;
  customerId?: string;
  integration: IIntegration;
  readUserIds: string[];
  assignedUserId?: string;
}

export interface IIntegration {
  name: string;
  kind: string;
  brand: {
    name: string;
  };
}

export interface IBrand {
  name: string;
}

export interface IMessage {
  _id: string;
  userId?: string;
  customerId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  attachments?: IAttachment[];
  formWidgetData?: IFormWidgetItem[];
  internal?: boolean;
}
