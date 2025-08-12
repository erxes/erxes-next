import { useGetProject } from '@/project/hooks/useGetProject';
import { ProjectFields } from '@/project/components/details/ProjectFields';
import { ProjectsSideWidget } from '@/project/components/details/ProjectsSideWidget';

export const ProjectDetails = ({ projectId }: { projectId: string }) => {
  const { project } = useGetProject({
    variables: { _id: projectId },
  });

  if (!project) {
    return null;
  }

  return (
    <div className="h-full w-full flex overflow-hidden">
      <div className="h-full flex flex-auto justify-center mt-12 px-6">
        <div className="w-full xl:max-w-3xl">
          <ProjectFields projectId={projectId} />
        </div>
      </div>
      <ProjectsSideWidget projectId={projectId} />
    </div>
  );
};
