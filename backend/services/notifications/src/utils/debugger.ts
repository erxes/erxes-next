import { getEnv } from 'erxes-api-shared/utils';

const NOTIFICATION_DEBUG = getEnv({ name: 'NOTIFICATION_DEBUG', defaultValue: 'false' }) === 'true';

export const debugInfo = (message: string, extra?: any) => {
  if (NOTIFICATION_DEBUG) {
    console.log(`[NOTIFICATION-INFO] ${new Date().toISOString()}: ${message}`, extra || '');
  }
};

export const debugError = (message: string | Error, extra?: any) => {
  const errorMessage = message instanceof Error ? message.message : message;
  const stack = message instanceof Error ? message.stack : '';
  
  console.error(`[NOTIFICATION-ERROR] ${new Date().toISOString()}: ${errorMessage}`, extra || '');
  
  if (stack && NOTIFICATION_DEBUG) {
    console.error(stack);
  }
};

export const debugWarn = (message: string, extra?: any) => {
  if (NOTIFICATION_DEBUG) {
    console.warn(`[NOTIFICATION-WARN] ${new Date().toISOString()}: ${message}`, extra || '');
  }
};
