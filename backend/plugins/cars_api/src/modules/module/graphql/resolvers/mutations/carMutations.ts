import { IContext } from '~/connectionResolvers';
import { ICar, ICarDocument } from '~/modules/module/@types/car';

export const carMutations = {
  createCar: async (_root: undefined, doc: ICar, { models }: IContext) => {
    return await models.Cars.createCar({ ...doc });
  },

  updateCar: async (
    _root: undefined,
    { _id, ...doc }: ICarDocument,
    { models }: IContext,
  ) => {
    return await models.Cars.updateCar(_id, doc);
  },

  removeCar: async (_root: undefined, { _id }, { models }: IContext) => {
    return models.Cars.removeCar(_id);
  },
};
