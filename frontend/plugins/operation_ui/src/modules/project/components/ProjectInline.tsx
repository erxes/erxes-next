import { useProjects } from '@/project/hooks/useGetProjects';
import { cn } from 'erxes-ui';
import { forwardRef } from 'react';

export const ProjectInline = forwardRef<
  HTMLDivElement,
  { projectId: string } & React.HTMLAttributes<HTMLDivElement>
>(({ projectId, className, ...props }, ref) => {
  const { projects } = useProjects();

  const project = projects?.find((project) => project._id === projectId);

  return (
    <div
      ref={ref}
      className={cn('inline-flex gap-1 items-center font-medium', className)}
      {...props}
    >
      {project?.name || 'No Project'}
    </div>
  );
});

ProjectInline.displayName = 'ProjectInline';
