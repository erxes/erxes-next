import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { ICarDocument } from '~/modules/cars/@types/car';

export default {
  category: async (car: ICarDocument, _args: any, { models }: IContext) => {
    return models.CarCategories.findOne({ _id: car.categoryId });
  },

  isAvailable: (car: ICarDocument) => {
    return car.status === 'active';
  },

  customer: async (car: ICarDocument, _args: any) => {
    const result = await sendTRPCMessage({
      method: `query`,
      pluginName: `core`,
      module: `customers`,
      action: `findOne`,
      input: {
        query: { _id: car.ownerId },
      },
    });

    return result;
  },
};
