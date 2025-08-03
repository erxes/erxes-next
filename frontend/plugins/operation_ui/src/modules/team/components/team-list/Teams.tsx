import { TeamLine } from '@/team/components/team-list/TeamLine';
import { useGetTeams } from '@/team/hooks/useGetTeams';

export const Teams = () => {
  const { teams } = useGetTeams();

  return (
    <div className="w-full">
      <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
        <div className="w-[40%] sm:w-[50%] xl:w-[50%]">Title</div>
        <div className="w-[20%] sm:w-[20%] xl:w-[20%] pl-2.5">Members</div>
        <div className="w-[20%] sm:w-[15%] xl:w-[15%] pl-2.5">Tasks</div>
        <div className="w-[20%] sm:w-[15%] xl:w-[15%] pl-2.5">Created At</div>
      </div>
      <div className="w-full">
        {teams?.map((team: any) => (
          <TeamLine key={team._id} team={team} />
        ))}
      </div>
    </div>
  );
};
