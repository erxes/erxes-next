import { IContext } from '~/connectionResolvers';
import { ICarDocument } from '~/modules/module/@types/car';

export default {
  category: async (car: ICarDocument, _args: any, { models }: IContext) => {
    return models.CarCategories.findOne({ _id: car.categoryId });
  },

  isAvailable: (car: ICarDocument) => {
    return car.status === 'active';
  },
};
