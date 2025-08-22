import { TaskDetails } from '@/task/components/detail/TaskDetails';

const NotificationsWidgets = (props: any) => {
  const { contentTypeId } = props;
  return <TaskDetails taskId={contentTypeId} />;
};

export default NotificationsWidgets;
