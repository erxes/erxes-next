import { generateModels } from './connectionResolver';
import { handleCreateNotification } from './utils/handlers/notificationHandler';
import { debugInfo, debugError } from './utils/debugger';

// Fake job data for testing
const createFakeJob = (data: any) => ({
  data,
  id: 'test-job-123',
  name: 'create-notification',
  opts: {},
  timestamp: Date.now(),
  attemptsMade: 0,
  delay: 0,
  progress: 0,
  returnvalue: null,
});

async function testNotificationService() {
  debugInfo('Starting notification service test...');

  try {
    const subdomain = 'test';
    const models = await generateModels(subdomain);

    // Create a test notification config
    await models.NotificationConfigs.findOneAndUpdate(
      {
        contentType: 'frontline:conversation',
        action: 'assigned',
      },
      {
        contentType: 'frontline:conversation',
        action: 'assigned',
        enabled: true,
        inAppEnabled: true,
        emailEnabled: true,
        emailSubject: 'You have been assigned to a conversation',
        expiresAfterDays: 30,
        createdBy: 'system',
      },
      { upsert: true }
    );

    // Create a test user notification settings
    await models.UserNotificationSettings.findOneAndUpdate(
      { userId: 'test-user-123' },
      {
        userId: 'test-user-123',
        allNotificationsEnabled: true,
        inAppNotificationsEnabled: true,
        emailNotificationsEnabled: true,
        pluginSettings: {},
        typeSettings: {},
      },
      { upsert: true }
    );

    debugInfo('Test data created successfully');

    // Test notification creation
    const testJob = createFakeJob({
      subdomain: 'test',
      config: {
        title: 'Conversation Assigned',
        message: 'You have been assigned to conversation #123 from John Doe',
        type: 'info',
        userIds: ['test-user-123'],
        fromUserId: 'assigner-user-456',
        contentType: 'frontline:conversation',
        contentTypeId: 'conv-123',
        action: 'assigned',
        priority: 'medium',
        metadata: {
          conversationNumber: '#123',
          customerName: 'John Doe',
          channel: 'email',
        },
      },
    });

    debugInfo('Running notification handler...');
    const result = await handleCreateNotification(testJob as any);

    debugInfo('Notification handler result:', result);

    // Check created notifications
    const notifications = await models.Notifications.find({ userId: 'test-user-123' });
    debugInfo(`Created ${notifications.length} notifications:`, notifications);

    // Check email deliveries
    const emailDeliveries = await models.EmailDeliveries.find({ userId: 'test-user-123' });
    debugInfo(`Created ${emailDeliveries.length} email delivery records:`, emailDeliveries);

    debugInfo('Test completed successfully!');

  } catch (error) {
    debugError('Test failed:', error);
  }
}

// Only run test if this file is executed directly
if (require.main === module) {
  testNotificationService();
}
