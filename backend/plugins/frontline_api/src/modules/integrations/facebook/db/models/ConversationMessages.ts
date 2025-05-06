import * as strip from 'strip';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { conversationMessageSchema } from '@/integrations/facebook/db/definitions/conversationMessages';
import { IFacebookConversationMessage,IFacebookConversationMessageDocument } from '@/integrations/facebook/@types/conversationMessages';


export interface IFacebookConversationMessageModel
  extends Model<IFacebookConversationMessageDocument> {
  getMessage(_id: string): Promise<IFacebookConversationMessageDocument>;
  createMessage(
    doc: IFacebookConversationMessage
  ): Promise<IFacebookConversationMessageDocument>;
  addMessage(
    doc: IFacebookConversationMessage,
    userId?: string
  ): Promise<IFacebookConversationMessageDocument>;
}

export const loadFacebookConversationMessageClass = (models: IModels) => {
  class Message {
    /**
     * Retreives message
     */
    public static async getMessage(_id: string) {
      const message = await models.FacebookConversationMessages.findOne({ _id }).lean();

      if (!message) {
        throw new Error('Conversation message not found');
      }

      return message;
    }
    /**
     * Create a message
     */
    public static async createMessage(doc: IFacebookConversationMessage) {
      const message = await models.FacebookConversationMessages.create({
        ...doc,
        createdAt: doc.createdAt || new Date()
      });

      return message;
    }

    /**
     * Create a conversation message
     */
    public static async addMessage(doc: IFacebookConversationMessageDocument, userId?: string) {
      const conversation = await models.FacebookConversations.findOne({
        _id: doc.conversationId
      });

      if (!conversation) {
        throw new Error(`Conversation not found with id ${doc.conversationId}`);
      }

      // normalize content, attachments
      const content = doc.content || '';
      const attachments = doc.attachments || [];

      doc.content = content;
      doc.attachments = attachments;

      // <img> tags wrapped inside empty <p> tag should be allowed
      const contentValid =
        content.indexOf('<img') !== -1 ? true : strip(content);

      // if there is no attachments and no content then throw content required error
      if (attachments.length === 0 && !contentValid) {
        throw new Error('Content is required');
      }

      return this.createMessage({ ...doc, userId });
    }
  }

  conversationMessageSchema.loadClass(Message);

  return conversationMessageSchema;
};
