import { INotification } from '@/notification/my-inbox/types/notifications';
import { atom } from 'jotai';

export const activeNotificationState = atom<Partial<INotification> | null>(
  null,
);
