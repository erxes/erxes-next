import { Model } from 'mongoose';

import { IModels } from '~/connectionResolvers';
import { getEnv } from 'erxes-api-shared/utils';
import {
  configSchema,
  IConfig,
  IConfigDocument,
} from '@/settings/db/definitions/configs';

export interface IConfigModel extends Model<IConfigDocument> {
  /**
   * Gets a config by its code.
   *
   * @param {string} code - The unique code identifier for the config.
   * @returns {Promise<IConfigDocument>} - A promise that resolves to the config document.
   * @throws {Error} - A config with the given code does not exist.
   */
  getConfig(code: string): Promise<IConfigDocument>;
  /**
   * Creates a new config or updates an existing one based on the provided code and value.
   *
   * @param {Object} param - Object containing the config details.
   * @param {string} param.code - The unique code identifier for the config.
   * @param {string} param.value - The value associated with the config.
   * @returns {Promise<IConfigDocument>} - A promise that resolves to the created or updated config document.
   */
  createOrUpdateConfig({ code, value }: IConfig): Promise<IConfigDocument>;
  constants();
  getCloudflareConfigs(): Promise<any>;
}

/**
 * Returns value of config entry as string
 * If running on saas version, get value from environment variable instead of database
 * @param models - models instance
 * @param name - config name
 * @param envKey - environment variable key
 * @param defaultValue - default value to return if config entry or environment variable do not exist
 * @returns {Promise<string>}
 */
export const getValueAsString = async (
  models: IModels,
  name: string,
  envKey: string,
  defaultValue?: string,
) => {
  const VERSION = getEnv({ name: 'VERSION' });

  if (VERSION && VERSION === 'saas') {
    return getEnv({ name: envKey, defaultValue });
  }

  const entry = await models.Configs.getConfig(name);

  if (entry.value) {
    return entry.value.toString();
  }

  return entry.value;
};

export const loadConfigClass = (models: IModels) => {
  class Config {
    public static async getConfig(code: string) {
      const config = await models.Configs.findOne({ code });

      if (!config) {
        throw new Error('Config not found');
      }

      return config;
    }

    public static async createOrUpdateConfig({
      code,
      value,
    }: {
      code: string;
      value: string[];
    }) {
      const obj = await models.Configs.findOne({ code });

      if (obj) {
        await models.Configs.updateOne({ _id: obj._id }, { $set: { value } });

        return models.Configs.findOne({ _id: obj._id });
      }

      return models.Configs.create({ code, value });
    }

    public static async getCloudflareConfigs() {
      const accountId = await getValueAsString(
        models,
        'CLOUDFLARE_ACCOUNT_ID',
        'CLOUDFLARE_ACCOUNT_ID',
      );

      const accessKeyId = await getValueAsString(
        models,
        'CLOUDFLARE_ACCESS_KEY_ID',
        'CLOUDFLARE_ACCESS_KEY_ID',
      );

      const secretAccessKey = await getValueAsString(
        models,
        'CLOUDFLARE_SECRET_ACCESS_KEY',
        'CLOUDFLARE_SECRET_ACCESS_KEY',
      );

      const bucket = await getValueAsString(
        models,
        'CLOUDFLARE_BUCKET_NAME',
        'CLOUDFLARE_BUCKET_NAME',
      );

      const useCdn = await getValueAsString(
        models,
        'CLOUDFLARE_USE_CDN',
        'CLOUDFLARE_USE_CDN',
      );

      const isPublic = await getValueAsString(
        models,
        'FILE_SYSTEM_PUBLIC',
        'FILE_SYSTEM_PUBLIC',
      );

      const apiToken = await getValueAsString(
        models,
        'CLOUDFLARE_API_TOKEN',
        'CLOUDFLARE_API_TOKEN',
      );

      return {
        accountId,
        accessKeyId,
        region: 'auto',
        secretAccessKey,
        bucket,
        useCdn,
        isPublic,
        apiToken,
      };
    }
  }

  configSchema.loadClass(Config);

  return configSchema;
};
