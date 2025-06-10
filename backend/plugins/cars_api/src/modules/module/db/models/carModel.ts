import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { carSchema } from '~/modules/module/db/definitions/car';
import { ICar, ICarDocument } from '~/modules/module/@types/car';

export interface ICarModel extends Model<ICarDocument> {
  getCar(_id: string): Promise<ICarDocument>;
  getCars(): Promise<ICarDocument[]>;
  carsCount(): Promise<ICarDocument>;
  createCar(doc: ICar): Promise<ICarDocument>;
  updateCar(_id: string, doc: ICar): Promise<ICarDocument>;
  removeCar(ModuleId: string): Promise<{ ok: number }>;
}

export const loadCarClass = (models: IModels) => {
  class Cars {
    /**
     * Retrieves cars
     */
    public static async getCar(_id: string) {
      const cars = await models.Cars.findOne({ _id }).lean();

      if (!cars) {
        throw new Error('Car not found');
      }

      return cars;
    }

    /**
     * Retrieves all carss
     */
    public static async getCars(): Promise<ICarDocument[]> {
      return models.Cars.find().lean();
    }

    /**
     * Create a cars
     */
    public static async createCar(doc: ICar): Promise<ICarDocument> {
      return models.Cars.create(doc);
    }

    /*
     * Update cars
     */
    public static async updateCar(_id: string, doc: ICar) {
      return await models.Cars.findOneAndUpdate({ _id }, { $set: { ...doc } });
    }

    /**
     * Remove cars
     */
    public static async removeCar(CarId: string[]) {
      return models.Cars.deleteOne({ _id: { $in: CarId } });
    }
  }

  carSchema.loadClass(Cars);

  return carSchema;
};
