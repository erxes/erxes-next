import { IExchangeRate, IExchangeRateDocument } from 'erxes-api-utils';
import { Model } from 'mongoose';
import { IModels } from '../../connectionResolvers';
import { exchangeRateSchema } from '../definitions/exchangeRate';

export interface IExchangeRateModel extends Model<IExchangeRateDocument> {
  getActiveRate({
    date,
    rateCurrency,
    mainCurrency,
  }: {
    date: Date;
    rateCurrency: string;
    mainCurrency?: string;
  }): Promise<IExchangeRateDocument>;
  getExchangeRate(selector: any): Promise<IExchangeRateDocument>;
  createExchangeRate(doc: IExchangeRate): Promise<IExchangeRateDocument>;
  updateExchangeRate(
    _id: string,
    doc: IExchangeRate,
  ): Promise<IExchangeRateDocument>;
  removeExchangeRates(_ids: string[]): Promise<{ n: number; ok: number }>;
}

export const loadExchangeRateClass = (models: IModels, subdomain: string) => {
  class ExchangeRate {
    /**
     *
     * Get ExchangeRateing Cagegory
     */

    public static async getExchangeRate(selector: any) {
      const exchangeRate = await models.ExchangeRates.findOne(selector).lean();

      if (!exchangeRate) {
        throw new Error('ExchangeRate not found');
      }

      return exchangeRate;
    }

    public static async getActiveRate({
      date,
      rateCurrency,
      mainCurrency,
    }: {
      date: Date;
      rateCurrency: string;
      mainCurrency?: string;
    }) {
      return await models.ExchangeRates.findOne({
        mainCurrency,
        rateCurrency,
      })
        .sort({ date: -1 })
        .lean();
    }

    /**
     * Create a exchangeRateing
     */
    public static async createExchangeRate(doc: IExchangeRate) {
      if (!doc) {
        throw new Error('Exchange rate document is required');
      }

      return models.ExchangeRates.create({
        ...doc,
        createdAt: new Date(),
      });
    }

    /**
     * Update ExchangeRateing
     */
    public static async updateExchangeRate(_id: string, doc: IExchangeRate) {
      await models.ExchangeRates.getExchangeRate({ _id });

      await models.ExchangeRates.updateOne(
        { _id },
        {
          $set: { ...doc, modifiedAt: new Date() },
        },
      );

      return await models.ExchangeRates.findOne({ _id }).lean();
    }

    /**
     * Remove exchangeRateings
     */
    public static async removeExchangeRates(ids: string[]) {
      await models.ExchangeRates.deleteMany({ _id: { $in: ids } });

      return 'success';
    }
  }

  exchangeRateSchema.loadClass(ExchangeRate);

  return exchangeRateSchema;
};
