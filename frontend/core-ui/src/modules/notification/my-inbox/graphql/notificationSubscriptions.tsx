export const NOTIFICATION_SUBSCRIPTION = `
	subscription notificationInserted($userId: String) {
		notificationInserted(userId: $userId) {
			_id
			title
			message
		}
  }
`;

export const NOTIFICATION_READ = `
	subscription notificationRead($userId: String) {
		notificationRead(userId: $userId)
  }
`;
