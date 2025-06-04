import { IAttachment } from 'erxes-ui';

export interface IFacebookConversationMessage {
  _id: string;
  content: string;
  createdAt: string;
  attachments: IAttachment[];
}
