import { IOrderInput } from 'erxes-api-shared/core-types';
import { graphqlPubsub } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { IStage } from '~/modules/tickets/@types/stage';
import { bulkUpdateOrders } from '~/modules/tickets/utils';

export const stageMutations = {
  /**
   * Update stage orders
   */
  async ticketsStagesUpdateOrder(
    _root: undefined,
    { orders }: { orders: IOrderInput[] },
    { models }: IContext,
  ) {
    return await models.Stages.updateOrder(orders);
  },

  /**
   * Edit stage
   */
  async ticketsStagesEdit(
    _root: undefined,
    { _id, ...doc }: IStage & { _id: string },
    { models }: IContext,
  ) {
    return await models.Stages.updateStage(_id, doc);
  },

  /**
   * Remove stage
   */
  async ticketsStagesRemove(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return await models.Stages.removeStage(_id);
  },

  async ticketsStagesSortItems(
    _root: undefined,
    {
      stageId,
      proccessId,
      sortType,
    }: {
      stageId: string;
      proccessId: string;
      sortType: string;
    },
    { models }: IContext,
  ) {
    const sortTypes = {
      'created-asc': { createdAt: 1 },
      'created-desc': { createdAt: -1 },
      'modified-asc': { modifiedAt: 1 },
      'modified-desc': { modifiedAt: -1 },
      'close-asc': { closeDate: 1, order: 1 },
      'close-desc': { closeDate: -1, order: 1 },
      'alphabetically-asc': { name: 1 },
    };
    const sort: { [key: string]: any } = sortTypes[sortType];

    if (sortType === 'close-asc') {
      await bulkUpdateOrders({
        collection: models.Tickets,
        stageId,
        sort,
        additionFilter: { closeDate: { $ne: null } },
      });
      await bulkUpdateOrders({
        collection: models.Tickets,
        stageId,
        sort: { order: 1 },
        additionFilter: { closeDate: null },
        startOrder: 100001,
      });
    } else {
      const response = await bulkUpdateOrders({
        collection: models.Tickets,
        stageId,
        sort,
      });

      if (!response) {
        return;
      }
    }

    const stage = await models.Stages.getStage(stageId);

    graphqlPubsub.publish(`ticketsPipelinesChanged:${stage.pipelineId}`, {
      ticketsPipelinesChanged: {
        _id: stage.pipelineId,
        proccessId,
        action: 'reOrdered',
        data: {
          destinationStageId: stageId,
        },
      },
    });

    return 'ok';
  },
};
