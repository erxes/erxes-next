import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { carSchema } from '~/modules/cars/db/definitions/car';
import { ICar, ICarDocument } from '~/modules/cars/@types/car';

export interface ICarModel extends Model<ICarDocument> {
  carDetail(_id: string): Promise<ICarDocument>;
  cars(): Promise<ICarDocument[]>;
  carsAdd(doc: ICar): Promise<ICarDocument>;
  carsEdit(_id: string, doc: ICar): Promise<ICarDocument>;
  carsRemove(ModuleId: string[]): Promise<{ ok: number }>;
  getCar(_id: string): Promise<ICarDocument>;
}

export const loadCarClass = (models: IModels) => {
  class Cars {
    public static async checkDuplication(
      carFields: {
        plateNumber?: string;
        vinNumber?: string;
      },
      idsToExclude?: string[] | string,
    ) {
      const query: { status: {}; [key: string]: any } = {
        status: { $ne: 'Deleted' },
      };
      let previousEntry;

      // Adding exclude operator to the query
      if (idsToExclude) {
        query._id = { $nin: idsToExclude };
      }

      if (carFields.plateNumber) {
        // check duplication from primaryName
        previousEntry = await models.Cars.find({
          ...query,
          plateNumber: carFields.plateNumber,
        });

        if (previousEntry.length > 0) {
          throw new Error('Duplicated plate number');
        }
      }

      if (carFields.vinNumber) {
        // check duplication from code
        previousEntry = await models.Cars.find({
          ...query,
          vinNumber: carFields.vinNumber,
        });

        if (previousEntry.length > 0) {
          throw new Error('Duplicated VIN number');
        }
      }
    }

    public static async getCar(_id: string) {
      const car = await models.Cars.findOne({ _id });

      if (!car) {
        throw new Error('Car not found');
      }

      return car;
    }

    /**
     * Retrieves cars
     */
    public static async carDetail(_id: string) {
      const cars = await models.Cars.findOne({ _id }).lean();

      if (!cars) {
        throw new Error('Car not found');
      }

      return cars;
    }

    /**
     * Retrieves all carss
     */
    public static async cars(): Promise<ICarDocument[]> {
      return models.Cars.find().lean();
    }

    /**
     * Create a cars
     */
    public static async carsAdd(doc: ICar): Promise<ICarDocument> {
      return models.Cars.create(doc);
    }

    /*
     * Update cars
     */
    public static async carsEdit(_id: string, doc: ICar) {
      return await models.Cars.findOneAndUpdate({ _id }, { $set: { ...doc } });
    }

    /**
     * Remove cars
     */
    public static async carsRemove(carIds: string[]) {
      console.log(2, carIds);
      return models.Cars.deleteMany({ _id: { $in: carIds } });
    }

    public static async carsMerge(carIds, carFields) {
      await this.checkDuplication(carFields, carIds);

      for (const carId of carIds) {
        models.Cars.getCar(carId);
        await models.Cars.findByIdAndUpdate(carId, {
          $set: { status: 'Deleted' },
        });
      }
    }
  }

  carSchema.loadClass(Cars);

  return carSchema;
};
