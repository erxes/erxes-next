import { ITeamMember } from '@/team/types';
import { IconX } from '@tabler/icons-react';
import { Avatar } from 'erxes-ui';
import { readImage } from 'erxes-ui';
import { Select } from 'erxes-ui';

export const MemberLine = ({ member }: { member: ITeamMember }) => {
  const { details } = member.member;

  return (
    <div className="w-full flex items-center py-3 px-6 border-b hover:bg-sidebar/50 border-muted-foreground/5 text-sm group">
      <div className="w-[70%] sm:w-[50%] xl:w-[50%] flex items-center gap-2">
        <div className="relative">
          <div className="inline-flex size-6 bg-muted/50 items-center justify-center rounded shrink-0">
            <Avatar size="lg">
              <Avatar.Image src={readImage(details?.avatar || '', 200)} />
              <Avatar.Fallback>
                {details?.firstName?.charAt(0) ||
                  details?.lastName?.charAt(0) ||
                  '-'}
              </Avatar.Fallback>
            </Avatar>
          </div>
        </div>
        <div className="flex flex-col items-start overflow-hidden">
          <span className="font-medium truncate w-full">
            {details?.firstName} {details?.lastName}
          </span>
        </div>
      </div>
      <div className="w-[30%] sm:w-[20%] xl:w-[20%] pl-2.5 text-right">
        <div className="flex items-center gap-2">
          <Select value={member.role}>
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
        <IconX
          size={16}
          className="stroke-foreground cursor-pointer"
          onClick={() => {
            console.log('123');
          }}
        />
      </div>
    </div>
  );
};
