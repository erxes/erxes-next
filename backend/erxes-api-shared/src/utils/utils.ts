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
