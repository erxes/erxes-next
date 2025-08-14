import { useGetProjectProgress } from '~/modules/project/hooks/useGetProjectProgress';
import { IconCircleFilled } from '@tabler/icons-react';
import { cn, Tooltip } from 'erxes-ui';

export const ProgressDot = ({
  status,
}: {
  status: 'started' | 'completed' | 'total';
}) => {
  return (
    <Tooltip.Provider>
      <Tooltip delayDuration={0}>
        <Tooltip.Trigger>
          <IconCircleFilled
            className={cn('size-2', {
              'text-warning': status === 'started',
              'text-success': status === 'completed',
              'text-primary': status === 'total',
            })}
          />
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p className="capitalize">{status}</p>
        </Tooltip.Content>
      </Tooltip>
    </Tooltip.Provider>
  );
};

export const Progress = ({ projectId }: { projectId: string }) => {
  const { projcetProgress } = useGetProjectProgress({
    variables: { _id: projectId },
    skip: !projectId,
  });

  return (
    <div className="flex justify-between w-full my-4">
      <span className="flex flex-col items-center gap-1">
        <span className="flex items-center gap-2">
          <ProgressDot status="total" />
          <p className="text-xs font-medium text-muted-foreground">Total:</p>
        </span>
        <p className="text-xs font-medium">
          {projcetProgress?.totalScope || 0}
        </p>
      </span>
      <span className="flex flex-col items-center gap-1">
        <span className="flex items-center gap-2">
          <ProgressDot status="started" />
          <p className="text-xs font-medium text-muted-foreground">Started:</p>
        </span>
        <p className="text-xs font-medium">
          {projcetProgress?.totalStartedScope || 0}
        </p>
      </span>
      <span className="flex flex-col items-center gap-1">
        <span className="flex items-center gap-2">
          <ProgressDot status="completed" />
          <p className="text-xs font-medium text-muted-foreground">
            Completed:
          </p>
        </span>
        <p className="text-xs font-medium">
          {projcetProgress?.totalCompletedScope || 0}
        </p>
      </span>
    </div>
  );
};
