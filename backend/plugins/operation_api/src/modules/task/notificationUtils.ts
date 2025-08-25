import type { ITask, ITaskDocument } from '@/task/@types/task';
import { sendNotification } from 'erxes-api-shared/core-modules';

export const createTaskNotification = async ({
  task,
  doc,
  userId,
  subdomain,
}: {
  task?: ITaskDocument;
  doc: Partial<ITask>;
  userId: string;
  subdomain: string;
}) => {
  if (doc.assigneeId && doc.assigneeId !== userId) {
    sendNotification(subdomain, {
      title: 'Task assigned',
      message: `You have been assigned to task ${doc.name || task?.name}`,
      type: 'info',
      userIds: [doc.assigneeId],
      priority: 'low',
      kind: 'user',
      fromUserId: userId,
      contentType: 'operation:task',
      contentTypeId: task?._id,
      notificationType: 'taskAssignee',
      metadata: {
        taskId: task?._id,
      },
    });
  }
};
