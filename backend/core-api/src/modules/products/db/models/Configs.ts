import { Model } from 'mongoose';
import { IProductsConfig, IProductsConfigDocument } from '../../@types/config';
import { productsConfigSchema } from '../definitions/configs';
import { IModels } from 'backend/core-api/src/connectionResolvers';

export interface IProductsConfigModel extends Model<IProductsConfigDocument> {
  getConfig(code: string, defaultValue?: string): Promise<any>;
  createOrUpdateConfig({
    code,
    value,
  }: IProductsConfig): IProductsConfigDocument;
}

export const loadProductsConfigClass = (models: IModels) => {
  class ProductsConfig {
    /*
     * Get a Config
     */
    public static async getConfig(code: string, defaultValue?: any) {
      const config = await models.ProductsConfigs.findOne({ code });

      if (!config) {
        return defaultValue || '';
      }

      return config.value;
    }

    /**
     * Create or update config
     */
    public static async createOrUpdateConfig({
      code,
      value,
    }: {
      code: string;
      value: string[];
    }) {
      const obj = await models.ProductsConfigs.findOne({ code });

      if (obj) {
        await models.ProductsConfigs.updateOne(
          { _id: obj._id },
          { $set: { value } },
        );

        return models.ProductsConfigs.findOne({ _id: obj._id });
      }

      return models.ProductsConfigs.create({ code, value });
    }
  }

  productsConfigSchema.loadClass(ProductsConfig);

  return productsConfigSchema;
};
