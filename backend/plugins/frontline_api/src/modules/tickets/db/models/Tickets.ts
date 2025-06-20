import { DeleteResult, Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { ITicket, ITicketDocument } from '~/modules/tickets/@types/ticket';
import { ticketSchema } from '~/modules/tickets/db/definitions/tickets';
import {
  boardNumberGenerator,
  fillSearchTextItem,
} from '~/modules/tickets/utils';

export interface ITicketModel extends Model<ITicketDocument> {
  createTicket(doc: ITicket): Promise<ITicketDocument>;
  getTicket(_id: string): Promise<ITicketDocument>;
  updateTicket(_id: string, doc: ITicket): Promise<ITicketDocument>;
  watchTicket(_id: string, isAdd: boolean, userId: string): void;
  removeTickets(_ids: string[]): Promise<DeleteResult>;
  createTicketComment(
    type: string,
    typeId: string,
    content: string,
    userType: string,
    customerId: string,
  ): Promise<ITicketDocument>;
  updateTimeTracking(
    _id: string,
    status: string,
    timeSpent: number,
    startDate: string,
  ): Promise<any>;
}

export const loadTicketClass = (models: IModels) => {
  class Ticket {
    /**
     * Retreives Ticket
     */
    public static async getTicket(_id: string) {
      const ticket = await models.Tickets.findOne({ _id });

      if (!ticket) {
        throw new Error('Ticket not found');
      }

      return ticket;
    }

    /**
     * Create a Ticket
     */
    public static async createTicket(doc: ITicket) {
      if (doc.sourceConversationIds) {
        const convertedTicket = await models.Tickets.findOne({
          sourceConversationIds: { $in: doc.sourceConversationIds },
        });

        if (convertedTicket) {
          throw new Error('Already converted a ticket');
        }
      }

      const stage = await models.Stages.getStage(doc.stageId);
      const pipeline = await models.Pipelines.getPipeline(stage.pipelineId);

      if (pipeline.numberSize) {
        const { numberSize, numberConfig = '' } = pipeline;

        const number = await boardNumberGenerator(
          models,
          numberConfig,
          numberSize,
          false,
          pipeline.type,
        );

        doc.number = number;
      }

      const ticket = await models.Tickets.create({
        ...doc,
        createdAt: new Date(),
        modifiedAt: new Date(),
        stageChangedDate: new Date(),
        searchText: fillSearchTextItem(doc),
      });

      // update numberConfig of the same configed pipelines
      if (doc.number) {
        await models.Pipelines.updateMany(
          {
            numberConfig: pipeline.numberConfig,
            type: pipeline.type,
          },
          { $set: { lastNum: doc.number } },
        );
      }

      return ticket;
    }

    public static async createTicketComment(
      type: string,
      typeId: string,
      content: string,
      userType: string,
      customerId?: string,
    ) {
      if (!typeId || !content) {
        throw new Error('typeId or content not found');
      }

      return await models.Comments.createComment({
        type,
        typeId,
        content,
        userType,
        userId: customerId,
      });
    }

    /**
     * Update Ticket
     */
    public static async updateTicket(_id: string, doc: ITicket) {
      const searchText = fillSearchTextItem(
        doc,
        await models.Tickets.getTicket(_id),
      );

      await models.Tickets.updateOne({ _id }, { $set: doc, searchText });

      return models.Tickets.findOne({ _id });
    }

    /**
     * Watch ticket
     */
    public static async watchTicket(
      _id: string,
      isAdd: boolean,
      userId: string,
    ) {
      const ticket = await models.Tickets.getTicket(_id);

      const watchedUserIds = ticket.watchedUserIds || [];

      if (isAdd) {
        watchedUserIds.push(userId);
      } else {
        const index = watchedUserIds.indexOf(userId);

        watchedUserIds.splice(index, 1);
      }

      return await models.Tickets.findOneAndUpdate(
        { _id },
        { $set: { watchedUserIds } },
        { new: true },
      );
    }

    public static async removeTickets(_ids: string[]) {
      // completely remove all related things
      await models.CheckLists.removeChecklists(_ids);

      return models.Tickets.deleteMany({ _id: { $in: _ids } });
    }

    /**
     * Update Time Tracking
     */
    public static async updateTimeTracking(
      _id: string,
      status: string,
      timeSpent: number,
      startDate?: string,
    ) {
      const doc: { status: string; timeSpent: number; startDate?: string } = {
        status,
        timeSpent,
      };

      if (startDate) {
        doc.startDate = startDate;
      }

      return await models.Tickets.findOneAndUpdate(
        { _id },
        { $set: { timeTrack: doc } },
        { new: true },
      );
    }
  }

  ticketSchema.loadClass(Ticket);

  return ticketSchema;
};
