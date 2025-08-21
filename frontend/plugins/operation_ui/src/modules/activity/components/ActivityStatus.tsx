import { useActivityListContext } from '@/activity/context/ActivityListContext';
import { IActivity } from '@/activity/types';
import { useGetStatusByTeam } from '@/task/hooks/useGetStatusByTeam';
import { StatusInlineIcon } from '@/task/components/StatusInline';
import { Badge } from 'erxes-ui';

export const ActivityStatus = ({
  metadata,
  action,
}: {
  metadata: IActivity['metadata'];
  action: IActivity['action'];
}) => {
  const { previousValue, newValue } = metadata;
  const { teamId } = useActivityListContext();
  const { statuses } = useGetStatusByTeam({
    variables: { teamId },
    skip: !teamId,
  });

  const getStatus = (value?: string) => {
    return (
      statuses?.find((status) => status.value === value) || {
        type: '',
        color: '',
        label: '',
      }
    );
  };

  return (
    <div className="flex items-center gap-1">
      changed status
      <Badge variant="secondary" className="capitalize">
        <StatusInlineIcon
          type={getStatus(previousValue)?.type}
          color={getStatus(previousValue)?.color}
        />
        {getStatus(previousValue)?.label}
      </Badge>
      to
      <Badge variant="secondary" className="capitalize">
        <StatusInlineIcon
          type={getStatus(newValue)?.type}
          color={getStatus(newValue)?.color}
        />
        {getStatus(newValue)?.label}
      </Badge>
    </div>
  );
};
