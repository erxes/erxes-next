import { useGetTeams } from '@/team/hooks/useGetTeams';
import { MemberLine } from '~/modules/team/components/members/MemberLine';

export const Members = () => {
  const { teams } = useGetTeams();

  return (
    <div>
      <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
        <div className="w-[70%] sm:w-[50%] xl:w-[50%]">Member</div>
        <div className="w-[30%] sm:w-[20%] xl:w-[20%] pl-2.5 text-right">
          Role
        </div>
      </div>

      <div className="w-full">
        {teams?.map((team: any) => (
          <MemberLine key={team._id} />
        ))}
      </div>
    </div>
  );
};
