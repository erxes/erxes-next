import { IconCircleFilled, IconCheck, IconClock } from '@tabler/icons-react';

export const CycleStatusDisplay = ({
  isActive,
  isCompleted,
}: {
  isActive: boolean;
  isCompleted: boolean;
}) => {
  const getStatusConfig = () => {
    if (isActive) {
      return {
        status: 'Active',
        icon: <IconCircleFilled className="size-4 text-green-600" />,
      };
    }
    if (isCompleted) {
      return {
        status: 'Completed',
        icon: <IconCheck className="size-4 text-blue-600" />,
      };
    }
    return {
      status: 'Upcoming',
      icon: <IconClock className="size-4 text-gray-500" />,
    };
  };

  const { status, icon } = getStatusConfig();

  return (
    <>
      {icon}
      <span className="text-sm font-medium">{status}</span>
    </>
  );
};
