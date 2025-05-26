import { IOrderInput } from '@/core-types';
import dayjs from 'dayjs';
import mongoose from 'mongoose';
import stripAnsi from 'strip-ansi';

export const getEnv = ({
  name,
  defaultValue,
  subdomain,
}: {
  name: string;
  defaultValue?: string;
  subdomain?: string;
}): string => {
  let value = process.env[name] || '';

  if (!value && typeof defaultValue !== 'undefined') {
    return defaultValue;
  }

  if (subdomain) {
    value = value.replace('<subdomain>', subdomain);
  }

  return value || '';
};

export const getSubdomain = (req: any): string => {
  const hostname =
    req.headers['nginx-hostname'] || req.headers.hostname || req.hostname;
  const subdomain = hostname.replace(/(^\w+:|^)\/\//, '').split('.')[0];
  return subdomain;
};

export const connectionOptions: mongoose.ConnectOptions = {
  family: 4,
};

export const authCookieOptions = (options: any = {}) => {
  const NODE_ENV = getEnv({ name: 'NODE_ENV' });
  const maxAge = options.expires || 14 * 24 * 60 * 60 * 1000;

  const secure = !['test', 'development'].includes(NODE_ENV);

  if (!secure && options.sameSite) {
    delete options.sameSite;
  }

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + maxAge),
    maxAge,
    secure,
    ...options,
  };

  return cookieOptions;
};

export const paginate = (
  collection: any,
  params: {
    ids?: string[];
    page?: number;
    perPage?: number;
    excludeIds?: boolean;
  },
) => {
  const { page = 1, perPage = 20, ids, excludeIds } = params || { ids: null };

  const _page = Number(page || '1');
  const _limit = Number(perPage || '20');

  if (ids && ids.length > 0) {
    return excludeIds ? collection.limit(_limit) : collection;
  }

  return collection.limit(_limit).skip((_page - 1) * _limit);
};

export const validSearchText = (values: string[]) => {
  const value = values.join(' ');

  if (value.length < 512) {
    return value;
  }

  return value.substring(0, 511);
};

export const getCoreDomain = () => {
  const NODE_ENV = process.env.NODE_ENV;

  return NODE_ENV === 'production'
    ? 'https://erxes.io'
    : 'http://localhost:3500';
};

export const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
export const updateOrder = async (collection: any, orders: IOrderInput[]) => {
  if (orders.length === 0) {
    return [];
  }

  const ids: string[] = [];
  const bulkOps: Array<{
    updateOne: {
      filter: { _id: string };
      update: { order: number };
    };
  }> = [];

  for (const { _id, order } of orders) {
    ids.push(_id);

    const selector: { order: number } = { order };

    bulkOps.push({
      updateOne: {
        filter: { _id },
        update: selector,
      },
    });
  }

  await collection.bulkWrite(bulkOps);

  return collection.find({ _id: { $in: ids } }).sort({ order: 1 });
};

export const pluralFormation = (type: string) => {
  if (type[type.length - 1] === 'y') {
    return type.slice(0, -1) + 'ies';
  }

  return type + 's';
};

export const chunkArray = <T>(myArray: T[], chunkSize: number): T[][] => {
  const tempArray: T[][] = [];

  for (let index = 0; index < myArray.length; index += chunkSize) {
    const myChunk = myArray.slice(index, index + chunkSize);
    tempArray.push(myChunk);
  }

  return tempArray;
};

export const cleanHtml = (content?: string): string =>
  stripAnsi(content || '').substring(0, 100);

/**
 * Splits text into chunks of strings limited by the given character count.
 *
 * Regex explanation:
 * .{1,100}(\\s|$)
 * - .         → matches any character (except line terminators)
 * - {1,100}   → matches 1 to 100 of the preceding token
 * - (\\s|$)   → ends with a whitespace OR end of string
 *
 * @param str - Text to be split
 * @param size - Character length of each chunk
 * @returns An array of string chunks
 */
export const splitStr = (str: string, size: number): string[] => {
  const cleanStr = stripAnsi(str);

  const regex = new RegExp(`.{1,${size}}(\\s|$)`, 'g');

  return cleanStr.match(regex) || [];
};

export const fixDate = (
  value: string | number | Date,
  defaultValue: Date = new Date(),
): Date => {
  const date = new Date(value);

  if (!isNaN(date.getTime())) {
    return date;
  }

  return defaultValue;
};

export const getDate = (date: Date, day: number): Date => {
  const currentDate = new Date();

  date.setDate(currentDate.getDate() + day + 1);
  date.setHours(0, 0, 0, 0);

  return date;
};

export const getToday = (date: Date): Date => {
  return getFullDate(date);
};

export const getFullDate = (date: Date) => {
  return new Date(dayjs(date).format('YYYY-MM-DD'));
};

export const getPureDate = (date: Date, multiplier = 1) => {
  const ndate = new Date(date);
  const diffTimeZone =
    multiplier * Number(process.env.TIMEZONE || 0) * 1000 * 60 * 60;
  return new Date(ndate.getTime() - diffTimeZone);
};

export const getTomorrow = (date: Date) => {
  return new Date(dayjs(date).add(1, 'day').format('YYYY-MM-DD'));
};

export const getNextMonth = (date: Date): { start: number; end: number } => {
  const today = getToday(date);
  const currentMonth = new Date().getMonth();

  if (currentMonth === 11) {
    today.setFullYear(today.getFullYear() + 1);
  }

  const month = (currentMonth + 1) % 12;
  const start = today.setMonth(month, 1);
  const end = today.setMonth(month + 1, 0);

  return { start, end };
};

export const fixNum = (value?: number, p = 4) => {
  const cleanNumber = Number((value ?? '').toString().replace(/,/g, ''));

  if (isNaN(cleanNumber)) {
    return 0;
  }

  return Number(cleanNumber.toFixed(p));
};

const DATE_OPTIONS = {
  d: 1000 * 60 * 60 * 24,
  h: 1000 * 60 * 60,
  m: 1000 * 60,
  s: 1000,
  ms: 1,
};

const CHARACTERS =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@#$%^&*()-=+{}[]<>.,:;"`|/?';

const BEGIN_DIFF = 1577836800000; // new Date('2020-01-01').getTime();

export const dateToShortStr = (
  date?: Date | string | number,
  scale?: 10 | 16 | 62 | 92 | number,
  kind?: 'd' | 'h' | 'm' | 's' | 'ms',
) => {
  date = new Date(date || new Date());

  if (!scale) {
    scale = 62;
  }
  if (!kind) {
    kind = 'd';
  }

  const divider = DATE_OPTIONS[kind];
  const chars = CHARACTERS.substring(0, scale);

  let intgr = Math.round((date.getTime() - BEGIN_DIFF) / divider);

  let short = '';

  while (intgr > 0) {
    const preInt = intgr;
    intgr = Math.floor(intgr / scale);
    const strInd = preInt - intgr * scale;
    short = `${chars[strInd]}${short}`;
  }

  return short;
};

export const shortStrToDate = (
  shortStr: string,
  scale?: 10 | 16 | 62 | 92 | number,
  kind?: 'd' | 'h' | 'm' | 's' | 'ms',
  resultType?: 'd' | 'n',
) => {
  if (!shortStr) return;

  if (!scale) {
    scale = 62;
  }
  if (!kind) {
    kind = 'd';
  }
  const chars = CHARACTERS.substring(0, scale);
  const multiplier = DATE_OPTIONS[kind];

  let intgr = 0;
  let scaler = 1;

  for (let i = shortStr.length; i--; i >= 0) {
    const char = shortStr[i];
    intgr = intgr + scaler * chars.indexOf(char);
    scaler = scaler * scale;
  }

  intgr = intgr * multiplier + BEGIN_DIFF;

  if (resultType === 'd') return new Date(intgr);

  return intgr;
};

export const isImage = (mimetypeOrName: string) => {
  const extensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];

  // extract extension from file name
  const extension = mimetypeOrName.split('.').pop();
  if (extensions.includes(extension || '')) {
    return true;
  }

  return mimetypeOrName.includes('image');
};

export const isVideo = (mimeType: string) => {
  return mimeType.includes('video');
};
