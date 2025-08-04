import { MemberLine } from '@/team/components/members/MemberLine';
import { useGetTeamMembers } from '@/team/hooks/useGetTeamMembers';
import { AddMembers } from '@/team/components/members/AddMembers';

export const Members = () => {
  const { members } = useGetTeamMembers();

  return (
    <div>
      <div className="ml-auto flex justify-between px-8 py-6">
        <h1 className="text-xlfont-semibold">Members</h1>
        <AddMembers />
      </div>
      <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
        <div className="w-[70%] sm:w-[50%] xl:w-[50%]">Member</div>
        <div className="w-[30%] sm:w-[20%] xl:w-[20%] pl-2.5 text-right">
          Role
        </div>
      </div>

      <div className="w-full">
        {members?.map((member: any) => (
          <MemberLine key={member._id} member={member} />
        ))}
      </div>
    </div>
  );
};
