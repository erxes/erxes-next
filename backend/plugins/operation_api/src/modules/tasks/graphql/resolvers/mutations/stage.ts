import { IOrderInput } from 'erxes-api-shared/core-types';
import { graphqlPubsub } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { IStage } from '~/modules/tasks/@types/stages';
import { bulkUpdateOrders } from '~/modules/tasks/graphql/resolvers/utils';

export const stageMutations = {
  /**
   * Update stage orders
   */
  async tasksStagesUpdateOrder(
    _root,
    { orders }: { orders: IOrderInput[] },
    { models }: IContext,
  ) {
    return models.Stages.updateOrder(orders);
  },

  /**
   * Edit stage
   */
  async tasksStagesEdit(
    _root,
    { _id, ...doc }: IStage & { _id: string },
    { models }: IContext,
  ) {
    return await models.Stages.updateStage(_id, doc);
  },

  /**
   * Remove stage
   */
  async tasksStagesRemove(
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return await models.Stages.removeStage(_id);
  },

  /**
   * Sort items
   */
  async tasksStagesSortItems(
    _root,
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
        collection: models.Tasks,
        stageId,
        sort,
        additionFilter: { closeDate: { $ne: null } },
      });
      await bulkUpdateOrders({
        collection: models.Tasks,
        stageId,
        sort: { order: 1 },
        additionFilter: { closeDate: null },
        startOrder: 100001,
      });
    } else {
      const response = await bulkUpdateOrders({
        collection: models.Tasks,
        stageId,
        sort,
      });

      if (!response) {
        return;
      }
    }

    const stage = await models.Stages.getStage(stageId);

    graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
      tasksPipelinesChanged: {
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
