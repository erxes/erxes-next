import { IconX } from '@tabler/icons-react';
import { Button, Select } from 'erxes-ui';
import { useTeamMemberUpdate } from '@/team/hooks/useTeamMemberUpdate';
import { useTeamMemberRemove } from '@/team/hooks/useTeamMemberRemove';
import { MembersInline } from 'ui-modules';

export const MemberLine = ({
  _id,
  memberId,
  role,
}: {
  _id: string;
  memberId: string;
  role: string;
}) => {
  const { updateTeamMember } = useTeamMemberUpdate();
  const { removeTeamMember } = useTeamMemberRemove();

  const roleHandler = (value: string) => {
    updateTeamMember({
      variables: {
        _id,
        role: value,
      },
    });
  };

  const removeHandler = () => {
    removeTeamMember({
      variables: {
        _id,
      },
    });
  };

  return (
    <MembersInline.Provider memberIds={[memberId]}>
      <div className="w-full flex items-center py-3 px-6 border-b hover:bg-sidebar/50 border-muted-foreground/5 text-sm group">
        <div className="w-[70%] sm:w-[50%] xl:w-[50%] flex items-center gap-2">
          <div className="relative">
            <div className="inline-flex size-6 bg-muted/50 items-center justify-center rounded shrink-0">
              <MembersInline.Avatar />
            </div>
          </div>
          <div className="flex flex-col items-start overflow-hidden">
            <span className="font-medium truncate w-full">
              <MembersInline.Title />
            </span>
          </div>
        </div>
        <div className="w-[30%] sm:w-[20%] xl:w-[20%] pl-2.5 text-right">
          <div className="flex items-center gap-2">
            <Select value={role} onValueChange={roleHandler}>
              <Select.Trigger id="time-unit">
                <Select.Value placeholder="Select role" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="admin">
                  <p className="text-xs">Admin</p>
                </Select.Item>
                <Select.Item value="lead">
                  <p className="text-xs">Lead</p>
                </Select.Item>
                <Select.Item value="member">
                  <p className="text-xs">Member</p>
                </Select.Item>
              </Select.Content>
            </Select>
          </div>
        </div>
        <div className="w-[30%] sm:w-[20%] xl:w-[20%] pl-2.5 text-right group-hover:block hidden">
          <Button onClick={removeHandler} variant="ghost" size="icon">
            <IconX />
          </Button>
        </div>
      </div>
    </MembersInline.Provider>
  );
};
