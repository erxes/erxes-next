import { RequestBrowserInfoParams } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { API_URL } from '../../config';
import { twMerge } from 'tailwind-merge';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

import {
  differenceInDays,
  differenceInSeconds,
  formatDistance,
  isToday,
  startOfDay,
} from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// get local storage item
export const getLocalStorageItem = (key: string): any => {
  return localStorage.getItem(key);
};

export const setLocalStorageItem = (key: string, value: any) => {
  localStorage.setItem(key, value);
};

export const removeLocalStorageItem = (key: string) => {
  localStorage.removeItem(key);
};

export const getVisitorId = async () => {
  const fp = await FingerprintJS.load();

  // The FingerprintJS agent is ready.
  const result = await fp.get();

  // This is the visitor identifier:
  return result.visitorId;
};

// Helper function to post message to parent window
const postMessage = (source: string, message: string, data: any = {}) => {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage(
      {
        fromWidget: true,
        source,
        message,
        data,
      },
      '*',
    );
  }
};

export const requestBrowserInfo = ({
  source,
  postData = {},
  callback,
}: RequestBrowserInfoParams) => {
  postMessage(source, 'requestingBrowserInfo', postData);

  let messageHandler: ((event: MessageEvent) => void) | null = null;
  let timeoutId: NodeJS.Timeout | null = null;

  messageHandler = (event: any) => {
    const data = event.data || {};
    const { fromPublisher, message, browserInfo } = data;

    if (
      fromPublisher &&
      source === data.source &&
      message === 'sendingBrowserInfo'
    ) {
      if (messageHandler) {
        window.removeEventListener('message', messageHandler);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      callback(browserInfo);
    }
  };

  window.addEventListener('message', messageHandler);

  // Fallback: if no browser info is received within 2 seconds, use default
  timeoutId = setTimeout(() => {
    if (messageHandler) {
      window.removeEventListener('message', messageHandler);
    }
    console.log('requestBrowserInfo: Using fallback browser info');
    callback({
      remoteAddress: '',
      region: '',
      countryCode: '',
      city: '',
      country: '',
      url: window.location.href,
      hostname: window.location.hostname,
      language: navigator.language,
      userAgent: navigator.userAgent,
    });
  }, 2000);
};

export const isValidURL = (url: string) => {
  try {
    return Boolean(new URL(url));
  } catch {
    return false;
  }
};

export const readImage = (value?: string, width?: number): string => {
  if (
    !value ||
    isValidURL(value) ||
    (typeof value === 'string' && value.includes('http')) ||
    (typeof value === 'string' && value.startsWith('/'))
  ) {
    return value || '';
  }

  let url = `${API_URL}/read-file?key=${encodeURIComponent(value)}`;

  if (width) {
    url += `&width=${width}`;
  }

  return url;
};

export const formatDateISOStringToRelativeDate = (
  isoDate: string,
  isDayMaximumPrecision = false,
) => {
  const now = new Date();
  const targetDate = new Date(isoDate);

  const secondsDiff = Math.abs(differenceInSeconds(targetDate, now));

  if (secondsDiff < 60) return 'just now';

  if (isDayMaximumPrecision && isToday(targetDate)) return 'Today';

  const isWithin24h = Math.abs(differenceInDays(targetDate, now)) < 1;

  if (isDayMaximumPrecision || !isWithin24h)
    return formatDistance(startOfDay(targetDate), startOfDay(now), {
      addSuffix: true,
    });

  return formatDistance(targetDate, now, { addSuffix: true });
};
