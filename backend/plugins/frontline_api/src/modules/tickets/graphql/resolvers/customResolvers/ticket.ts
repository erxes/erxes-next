import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { ITicketDocument } from '~/modules/tickets/@types/ticket';

export default {
  async __resolveReference({ _id }, { models }: IContext) {
    return models.Tickets.findOne({ _id });
  },

  async companies(
    ticket: ITicketDocument,
    _args: undefined,
    _context: IContext,
    { isSubscription },
  ) {
    // const companyIds = await sendCoreMessage({
    //   subdomain,
    //   action: 'conformities.savedConformity',
    //   data: {
    //     mainType: 'ticket',
    //     mainTypeId: ticket._id,
    //     relTypes: ['company'],
    //   },
    //   isRPC: true,
    //   defaultValue: [],
    // });

    // const companies = await sendTRPCMessage({
    //   pluginName: 'core',
    //   module: 'companies',
    //   action: 'findActiveCompanies',
    //   input: {
    //     selector: {
    //       _id: { $in: ticket.companyIds },
    //     },
    //   },
    //   defaultValue: [],
    // });

    // if (isSubscription) {
    //   return companies;
    // }

    // return (companies || []).map(({ _id }) => ({ __typename: 'Company', _id }));

    return [];
  },

  async customers(
    ticket: ITicketDocument,
    _args: undefined,
    _context: IContext,
    { isSubscription },
  ) {
    // const customerIds = await sendCoreMessage({
    //   subdomain,
    //   action: 'conformities.savedConformity',
    //   data: {
    //     mainType: 'ticket',
    //     mainTypeId: ticket._id,
    //     relTypes: ['customer'],
    //   },
    //   isRPC: true,
    //   defaultValue: [],
    // });

    // const customers = await sendTRPCMessage({
    //   pluginName: 'core',
    //   module: 'customers',
    //   action: 'findActiveCustomers',
    //   input: {
    //     selector: {
    //       _id: { $in: ticket.customerIds },
    //     },
    //   },
    //   defaultValue: [],
    // });

    // if (isSubscription) {
    //   return customers;
    // }

    // return (customers || []).map(({ _id }) => ({
    //   __typename: 'Customer',
    //   _id,
    // }));

    return [];
  },

  async assignedUsers(
    ticket: ITicketDocument,
    _args: undefined,
    _context: IContext,
    { isSubscription },
  ) {
    if (isSubscription && ticket.assignedUserIds?.length) {
      return sendTRPCMessage({
        pluginName: 'core',
        module: 'users',
        action: 'find',
        input: {
          query: {
            _id: { $in: ticket.assignedUserIds },
          },
        },
        defaultValue: [],
      });
    }

    return (ticket.assignedUserIds || [])
      .filter((e) => e)
      .map((_id) => ({
        __typename: 'User',
        _id,
      }));
  },

  async pipeline(
    ticket: ITicketDocument,
    _args: undefined,
    { models }: IContext,
  ) {
    const stage = await models.Stages.getStage(ticket.stageId);

    return models.Pipelines.findOne({ _id: stage.pipelineId });
  },

  async boardId(
    ticket: ITicketDocument,
    _args: undefined,
    { models }: IContext,
  ) {
    const stage = await models.Stages.getStage(ticket.stageId);
    const pipeline = await models.Pipelines.getPipeline(stage.pipelineId);
    const board = await models.Boards.getBoard(pipeline.boardId);

    return board._id;
  },

  async stage(ticket: ITicketDocument, _args: undefined, { models }: IContext) {
    return models.Stages.getStage(ticket.stageId);
  },

  async isWatched(
    ticket: ITicketDocument,
    _args: undefined,
    { user }: IContext,
  ) {
    const watchedUserIds = ticket.watchedUserIds || [];

    if (watchedUserIds.includes(user._id)) {
      return true;
    }

    return false;
  },

  async labels(
    ticket: ITicketDocument,
    _args: undefined,
    { models }: IContext,
  ) {
    return models.PipelineLabels.find({ _id: { $in: ticket.labelIds || [] } });
  },

  async tags(ticket: ITicketDocument) {
    if (!ticket.tagIds || ticket.tagIds.length === 0) {
      return [];
    }

    return ticket.tagIds.map((_id) => ({ __typename: 'Tag', _id }));
  },

  createdUser(ticket: ITicketDocument) {
    if (!ticket.userId) {
      return;
    }

    return { __typename: 'User', _id: ticket.userId };
  },
};
