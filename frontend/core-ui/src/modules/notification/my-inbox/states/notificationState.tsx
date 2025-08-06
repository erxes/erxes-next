import { INotification } from '@/notification/my-inbox/types/notifications';
import { atom } from 'jotai';

export const activeNotificationState = atom<Partial<INotification> | null>(
  null,
);

export const notificationsContainerScrollState = atom<number | null>(null);

export const refetchNewNotificationsState = atom(false);

export const selectedNotificationsState = atom<Array<string>>([]);

export const setSelectNotificationsState = atom(
  null,
  (get, set, notificationId: string) => {
    const isChecked = get(selectedNotificationsState).includes(notificationId);
    if (isChecked) {
      set(
        selectedNotificationsState,
        get(selectedNotificationsState).filter((id) => id !== notificationId),
      );
    } else {
      set(selectedNotificationsState, [
        ...get(selectedNotificationsState),
        notificationId,
      ]);
    }
  },
);
