import { Avatar } from 'erxes-ui';
import { IMember } from '../types/TeamMembers';

export const MemberListInlineAvatars = ({
  members,
}: {
  members: IMember[];
}) => {
  const withAvatar = members.slice(0, members.length > 3 ? 2 : 3);
  return (
    <div className="flex -space-x-1.5">
      {withAvatar.map((member) => (
        <Avatar size="lg" className="ring-2 ring-background bg-background">
          <Avatar.Image src={member.details.avatar} />
          <Avatar.Fallback colorSeed={member._id}>
            {member.details.fullName.charAt(0)}
          </Avatar.Fallback>
        </Avatar>
      ))}
      {members.length - withAvatar.length > 0 && (
        <Avatar size="lg" className="ring-2 ring-background bg-background">
          <Avatar.Fallback className="bg-primary/10 text-primary">
            +{members.length - withAvatar.length}
          </Avatar.Fallback>
        </Avatar>
      )}
    </div>
  );
};
