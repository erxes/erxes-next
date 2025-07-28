import { getFullDate } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';
import { nanoid } from 'nanoid';
import { IModels } from '~/connectionResolvers';
import BigNumber from 'bignumber.js';

/*
 * Mongoose field options wrapper
 */

interface Options {
  /**
   * @property {boolean} pkey хувьсагч нь primary key эсэх
   */
  pkey?: boolean;
  type?: any;
  optional?: boolean;
  default?: any;
  validate?: any;
  label?: string;
  index?: boolean;
  required?: boolean;
  enum?: Array<string>;
  min?: number;
  max?: number;
  selectOptions?: any;
  unique?: boolean;
}
/**
 *
 * @param options
 * @returns {Object} тухайн талбарын бүтэцийг буцаана
 */
export const field = (options: Options) => {
  const { pkey, type, optional } = options;

  if (type === String && !pkey && !optional) {
    options.validate = /\S+/;
  }

  // TODO: remove
  if (pkey) {
    options.type = String;
    options.default = () => nanoid();
  }

  return options;
};

export const schemaWrapper = (schema: Schema) => {
  schema.add({ scopeBrandIds: [String] });

  return schema;
};

export const schemaHooksWrapper = (schema: any, _cacheKey: string) => {
  return schemaWrapper(schema);
};

export const addMonths = (date: Date, months: number) => {
  date.setMonth(date.getMonth() + months);

  return new Date(date);
};

export const getNumber = async (models: IModels, contractTypeId: string) => {
  const preNumbered = await models.Contracts.findOne({
    contractTypeId: contractTypeId,
  }).sort({ createdAt: -1 });

  const type = await models.ContractTypes.getContractType({
    _id: contractTypeId,
  });

  if (!preNumbered) {
    return `${type.number}${'0'.repeat(type.vacancy - 1)}1`;
  }

  const preNumber = preNumbered.number;
  const preInt = Number(preNumber.replace(type.number, ''));

  const preStrLen = String(preInt).length;
  let lessLen = type.vacancy - preStrLen;

  if (lessLen < 0) lessLen = 0;

  return `${type.number}${'0'.repeat(lessLen)}${preInt + 1}`;
};

export const getDiffDay = (fromDate: Date, toDate: Date) => {
  const date1 = getFullDate(fromDate);
  const date2 = getFullDate(toDate);
  return (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24);
};

export const calcInterest = ({
  balance,
  interestRate,
  dayOfMonth = 30,
  fixed = 2,
}: {
  balance: number;
  interestRate: number;
  dayOfMonth?: number;
  fixed?: number;
}): number => {
  const interest = new BigNumber(interestRate).div(100).div(365);
  return new BigNumber(balance)
    .multipliedBy(interest)
    .multipliedBy(dayOfMonth)
    .dp(fixed, BigNumber.ROUND_HALF_UP)
    .toNumber();
};
