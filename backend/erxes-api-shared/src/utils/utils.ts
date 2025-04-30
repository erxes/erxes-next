/**
 * Gets environment variable value
 *
 * @param {Object} options - an object that contains:
 *   - {string} name - name of the environment variable
 *   - {string} [defaultValue] - default value if the environment variable is not defined
 *   - {string} [subdomain] - subdomain to replace if the environment variable contains `<subdomain>`
 * @returns {string} value of the environment variable or default value if it is not defined
 */
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

/**
 * Extracts the subdomain from the request object.
 *
 * The function checks the request headers for 'nginx-hostname' or 'hostname',
 * or defaults to req.hostname if neither are available. It then strips the
 * protocol from the hostname and splits the remaining string by dots,
 * returning the first segment as the subdomain.
 *
 * @param req - The request object containing headers and hostname information.
 * @returns The subdomain extracted from the request.
 */

export const getSubdomain = (req: any): string => {
  const hostname =
    req.headers['nginx-hostname'] || req.headers.hostname || req.hostname;
  const subdomain = hostname.replace(/(^\w+:|^)\/\//, '').split('.')[0];
  return subdomain;
};

/**
 * Returns an object of cookie options for use with express' res.cookie
 * suitable for authentication cookies.
 *
 * The function takes an optional object of options, and applies the
 * following defaults:
 * - `httpOnly: true`
 * - `expires: 14 days from now`
 * - `maxAge: 14 days from now in milliseconds`
 * - `secure: true` unless the environment is 'test' or 'development'
 * - `sameSite: undefined` unless the environment is 'test' or 'development',
 *   in which case sameSite is removed from the options
 *
 * @param {object} [options] Optional object of options. Valid keys are:
 *   - `expires`: number of milliseconds from now to expire the cookie
 *   - `maxAge`: number of milliseconds from now to expire the cookie
 *   - `secure`: boolean, whether the cookie should only be transmitted over
 *     a secure channel
 *   - `sameSite`: string, one of 'strict', 'lax', or 'none', indicating the
 *     level of same-site protection to apply to the cookie
 *
 * @returns {object} An object of cookie options suitable for use with
 *   express' res.cookie.
 */
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

/**
 * Returns the base URL for the core API, depending on the environment.
 *
 * In production, this is 'https://erxes.io', and in development, it is
 * 'http://localhost:3500'.
 *
 * @returns {string} the base URL for the core API
 */
export const getCoreDomain = () => {
  const NODE_ENV = process.env.NODE_ENV;

  return NODE_ENV === 'production'
    ? 'https://erxes.io'
    : 'http://localhost:3500';
};

export const chunkArray = <T>(myArray: T[], chunkSize: number): T[][] => {
  const tempArray: T[][] = [];

  for (let index = 0; index < myArray.length; index += chunkSize) {
    const myChunk = myArray.slice(index, index + chunkSize);
    tempArray.push(myChunk);
  }

  return tempArray;
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
