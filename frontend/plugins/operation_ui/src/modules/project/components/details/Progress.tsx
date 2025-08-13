import { useGetProjectProgress } from '~/modules/project/hooks/useGetProjectProgress';
import { IconCircleFilled } from '@tabler/icons-react';
export const Progress = ({ projectId }: { projectId: string }) => {
  const { projcetProgress } = useGetProjectProgress({
    variables: { _id: projectId },
    skip: !projectId,
  });

  return (
    <div className="flex justify-between w-full my-4">
      <span className="flex flex-col items-center gap-1">
        <span className="flex items-center gap-2">
          <IconCircleFilled className="w-2 h-2" color="grey" />
          <p className="text-xs font-medium text-muted-foreground">Total:</p>
        </span>
        <p className="text-xs font-medium">
          {projcetProgress?.totalScope || 0}
        </p>
      </span>
      <span className="flex flex-col items-center gap-1">
        <span className="flex items-center gap-2">
          <IconCircleFilled className="w-2 h-2" color="hsl(var(--chart-1))" />
          <p className="text-xs font-medium text-muted-foreground">Started:</p>
        </span>
        <p className="text-xs font-medium">
          {projcetProgress?.totalStartedScope || 0}
        </p>
      </span>
      <span className="flex flex-col items-center gap-1">
        <span className="flex items-center gap-2">
          <IconCircleFilled className="w-2 h-2" color="hsl(var(--chart-2))" />
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
