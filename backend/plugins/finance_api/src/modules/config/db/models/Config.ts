import { IUserDocument } from 'erxes-api-shared/core-types';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { configSchema } from '~/modules/config/db/definitions/config';
import { IConfig, IConfigDocument } from '~/modules/config/types';

export interface IConfigModel extends Model<IConfigDocument> {
  getConfig(_id: string, name?: string): Promise<IConfigDocument>;
  createConfig(doc: IConfig, user: IUserDocument): Promise<IConfigDocument>;
  updateConfig(
    _id: string,
    doc: IConfig,
    user: IUserDocument,
  ): Promise<IConfigDocument>;
  removeConfig(_id: string, user: IUserDocument): Promise<IConfigDocument>;
}

export const loadConfigClass = (models: IModels) => {
  class Config {
    public static async getConfig(_id: string, name?: string) {
      const config = await models.Configs.findOne({ $or: [{ _id }, { name }] });

      if (!config) {
        throw new Error('Oops, looks like this config doesn’t exist!');
      }

      return config;
    }

    public static async createConfig(doc: IConfig, user: IUserDocument) {
      this.validateConfig({ doc, user });

      return models.Configs.create({
        ...doc,
        createdBy: user._id || '',
      });
    }

    public static async updateConfig(
      _id: string,
      doc: IConfig,
      user: IUserDocument,
    ) {
      this.validateConfig({ _id, doc, user });

      return models.Configs.findOneAndUpdate(
        { _id },
        {
          ...doc,
          updatedBy: user._id || '',
        },
        { new: true },
      );
    }

    public static async removeConfig(_id: string, user: IUserDocument) {
      this.validateConfig({ _id, user });

      return models.Configs.findOneAndDelete({ _id });
    }

    public static async validateConfig({
      _id,
      doc,
      user,
    }: {
      _id?: string;
      doc?: IConfig;
      user: IUserDocument;
    }) {
      const { name } = doc || {};

      const config = await models.Configs.getConfig(_id as string, name);

      if (config.name === name) {
        throw new Error("Whoa, that name's already taken!");
      }

      if (_id && config.createdBy !== user._id) {
        throw new Error("Hey, you didn't make this config!");
      }
    }
  }

  configSchema.loadClass(Config);

  return configSchema;
};
