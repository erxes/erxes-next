import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fixNum(value: any, p = 4) {
  const cleanNumber = Number((value ?? '').toString().replace(/,/g, ''));

  if (isNaN(cleanNumber)) {
    return 0;
  }
  const multiplier = 10 ** p;

  const big = Math.round(Number((cleanNumber * multiplier).toFixed(2)));

  return Number((big / multiplier).toFixed(p));
}

/**
 * Send desktop notification
 */
export const sendDesktopNotification = (doc: {
  title: string;
  content?: string;
}) => {
  console.log({ permission: Notification.permission });
  const notify = () => {
    try {
      const notification = new Notification(doc.title, {
        body: doc.content,
        icon: '/favicon.png',
        dir: 'ltr',
      });
      console.log({ notificationDesktop: notification });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Notification error:', error);
    }
  };

  // Browser doesn't support Notification api
  if (!('Notification' in window)) {
    console.log('shit');
    return;
  }

  if (Notification.permission === 'granted') {
    return notify();
  }

  if (Notification.permission !== 'denied') {
    Notification.requestPermission((permission) => {
      if (!('permission' in Notification)) {
        (Notification as any).permission = permission;
      }

      if (permission === 'granted') {
        return notify();
      }
    });
  }
};
