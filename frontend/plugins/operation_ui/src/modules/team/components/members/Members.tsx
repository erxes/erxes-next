import { MemberLine } from '@/team/components/members/MemberLine';
import { useGetTeamMembers } from '@/team/hooks/useGetTeamMembers';
import { AddMembers } from '@/team/components/members/AddMembers';
import { useParams } from 'react-router';
import { SelectTeamMember } from '@/team/components/members/MemberForm';

export const Members = () => {
  const { id: teamId } = useParams();
  const { members } = useGetTeamMembers({ teamId });

  return (
    <div>
      <div className="ml-auto flex justify-between px-8 py-6">
        <h1 className="text-xlfont-semibold">Members</h1>
        <AddMembers />
      </div>
      <SelectTeamMember
        teamId={teamId}
        mode="multiple"
        value={[]}
        exclude={false}
      />
      <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
        <div className="w-[70%] sm:w-[50%] xl:w-[50%]">Member</div>
        <div className="w-[30%] sm:w-[20%] xl:w-[20%] pl-2.5 text-right">
          Role
        </div>
      </div>

      <div className="w-full">
        {members?.map((member: any) => (
          <MemberLine
            _id={member._id}
            key={member._id}
            memberId={member.memberId}
            role={member.role}
          />
        ))}
      </div>
    </div>
  );
};
