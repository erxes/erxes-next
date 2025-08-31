import { useActivityListContext } from '@/activity/context/ActivityListContext';
import { IActivity } from '@/activity/types';
import { ITask } from '@/task/types';
import { IProject } from '@/project/types';
import { useGetStatusByTeam } from '@/task/hooks/useGetStatusByTeam';
import { StatusInlineIcon } from '@/task/components/StatusInline';
import { Badge } from 'erxes-ui';
import { PROJECT_STATUS_OPTIONS } from '@/operation/constants/statusConstants';

const isTask = (content: ITask | IProject): content is ITask => {
  return 'teamId' in content;
};

export const ActivityStatus = ({
  metadata,
}: {
  metadata: IActivity['metadata'];
}) => {
  const { previousValue, newValue } = metadata;
  const contentDetail = useActivityListContext();

  const { statuses } = useGetStatusByTeam({
    variables: { teamId: isTask(contentDetail) ? contentDetail.teamId : '' },
    skip: !isTask(contentDetail),
  });

  const getTaskStatus = (value?: string) => {
    return (
      statuses?.find((status) => status.value === value) || {
        type: 0,
        color: '',
        label: '',
      }
    );
  };

  const getProjectStatus = (value?: string) => {
    const statusValue = value ? parseInt(value, 10) : 0;
    return (
      PROJECT_STATUS_OPTIONS.find((status) => status.value === statusValue) || {
        name: 'Unknown',
        Icon: null,
        IconColor: '#6B7280',
      }
    );
  };

  const renderStatusBadge = (value?: string) => {
    if (isTask(contentDetail)) {
      const status = getTaskStatus(value);
      return (
        <Badge variant="secondary" className="capitalize">
          <StatusInlineIcon type={status?.type} color={status?.color} />
          {status?.label}
        </Badge>
      );
    } else {
      const status = getProjectStatus(value);
      const IconComponent = status.Icon;
      return (
        <Badge variant="secondary" className="capitalize">
          {IconComponent && (
            <IconComponent
              size={12}
              style={{ color: status.IconColor }}
              className="mr-1"
            />
          )}
          {status.name}
        </Badge>
      );
    }
  };

  return (
    <div className="flex items-center gap-1">
      changed status
      {renderStatusBadge(previousValue)}
      to
      {renderStatusBadge(newValue)}
    </div>
  );
};
