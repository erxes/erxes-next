import { NOTIFICATION_FIELDS } from '@/notification/my-inbox/graphql/notificationsQueries';

export const NOTIFICATION_SUBSCRIPTION = `
	subscription notificationInserted($userId: String) {
		notificationInserted(userId: $userId) {
			${NOTIFICATION_FIELDS}
		}
  }
`;

export const NOTIFICATION_READ = `
	subscription notificationRead($userId: String) {
		notificationRead(userId: $userId)
  }
`;

export const NOTIFICATION_ARCHIVED = `
	subscription notificationArchived($userId: String) {
		notificationArchived(userId: $userId)
  }
`;
