import {
  MembersInlineContext,
  useMembersInlineContext,
} from '../contexts/MembersInlineContext';
import { IMember } from '../types/TeamMembers';
import {
  Avatar,
  AvatarProps,
  cn,
  Combobox,
  isUndefinedOrNull,
  Tooltip,
} from 'erxes-ui';
import { useAtomValue } from 'jotai';
import { currentUserState } from 'ui-modules/states';
import { IconUserCircle } from '@tabler/icons-react';
import { useMemberInline } from '../hooks';
import { useEffect } from 'react';

export const MembersInlineRoot = ({
  members,
  memberIds,
  placeholder,
  updateMembers,
  size,
}: {
  members?: IMember[];
  memberIds?: string[];
  placeholder?: string;
  updateMembers?: (members: IMember[]) => void;
  size?: 'lg';
}) => {
  return (
    <MembersInlineProvider
      members={members}
      memberIds={memberIds}
      placeholder={placeholder}
      updateMembers={updateMembers}
    >
      <MembersInlineAvatar size={size} />
      <MembersInlineTitle />
    </MembersInlineProvider>
  );
};

export const MembersInlineProvider = ({
  children,
  memberIds,
  members,
  placeholder,
  updateMembers,
}: {
  children?: React.ReactNode;
  memberIds?: string[];
  members?: IMember[];
  placeholder?: string;
  updateMembers?: (members: IMember[]) => void;
}) => {
  return (
    <MembersInlineContext.Provider
      value={{
        members: members || [],
        loading: false,
        memberIds: memberIds || [],
        placeholder: isUndefinedOrNull(placeholder)
          ? 'Select members'
          : placeholder,
        updateMembers,
      }}
    >
      <Tooltip.Provider>{children}</Tooltip.Provider>
      {memberIds
        ?.filter((id) => !members?.find((member) => member._id === id))
        .map((memberId) => (
          <MemberInlineEffectComponent key={memberId} memberId={memberId} />
        ))}
    </MembersInlineContext.Provider>
  );
};

const MemberInlineEffectComponent = ({ memberId }: { memberId: string }) => {
  const currentUser = useAtomValue(currentUserState) as IMember;
  const { members, memberIds, updateMembers } = useMembersInlineContext();
  const { userDetail } = useMemberInline({
    variables: {
      _id: memberId,
    },
    skip: !memberId || memberId === currentUser._id,
  });

  useEffect(() => {
    const newMembers = [...members].filter((m) => memberIds?.includes(m._id));

    if (userDetail) {
      updateMembers?.([...newMembers, { ...userDetail, _id: memberId }]);
    }

    if (currentUser._id === memberId) {
      updateMembers?.([currentUser, ...newMembers]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetail, currentUser]);

  return null;
};

export const MembersInlineAvatar = ({ className, ...props }: AvatarProps) => {
  const { members, loading, memberIds } = useMembersInlineContext();
  const currentUser = useAtomValue(currentUserState) as IMember;

  const sortedMembers = [...members].sort((a, b) => {
    if (a._id === currentUser?._id) return -1;
    if (b._id === currentUser?._id) return 1;
    return 0;
  });

  if (loading)
    return (
      <div className="flex -space-x-1.5">
        {memberIds?.map((memberId) => (
          <Avatar key={memberId} className={cn('bg-background', className)}>
            <Avatar.Fallback />
          </Avatar>
        ))}
      </div>
    );

  const renderAvatar = (member: IMember) => {
    const { details } = member;
    const { avatar, fullName } = details || {};

    if (member._id === currentUser._id) {
      return (
        <Tooltip delayDuration={100}>
          <Tooltip.Trigger asChild>
            <Avatar
              size="lg"
              {...props}
              className={cn(className, 'items-center justify-center')}
            >
              <IconUserCircle className="text-muted-foreground !size-5 flex-none" />
            </Avatar>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>You</p>
          </Tooltip.Content>
        </Tooltip>
      );
    }

    return (
      <Tooltip delayDuration={100}>
        <Tooltip.Trigger asChild>
          <Avatar
            className={cn(
              'bg-background',
              members.length > 1 && 'ring-2 ring-background',
              className,
            )}
            size="lg"
            {...props}
          >
            <Avatar.Image src={avatar} />
            <Avatar.Fallback>{fullName?.charAt(0) || ''}</Avatar.Fallback>
          </Avatar>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>{fullName}</p>
        </Tooltip.Content>
      </Tooltip>
    );
  };

  if (members.length === 0) return null;

  if (members.length === 1) return renderAvatar(members[0]);

  const withAvatar = sortedMembers.slice(0, sortedMembers.length > 3 ? 2 : 3);
  const restMembers = sortedMembers.slice(withAvatar.length);

  return (
    <div className="flex -space-x-1.5">
      {withAvatar.map(renderAvatar)}
      {restMembers.length > 0 && (
        <Tooltip delayDuration={100}>
          <Tooltip.Trigger asChild>
            <Avatar
              className={cn('ring-2 ring-background bg-background', className)}
              {...props}
              size="lg"
            >
              <Avatar.Fallback className="bg-primary/10 text-primary">
                +{restMembers.length}
              </Avatar.Fallback>
            </Avatar>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>{restMembers.map((m) => m.details.fullName).join(', ')}</p>
          </Tooltip.Content>
        </Tooltip>
      )}
    </div>
  );
};

export const MembersInlineTitle = () => {
  const { members, loading, placeholder } = useMembersInlineContext();
  const currentUser = useAtomValue(currentUserState) as IMember;
  const isCurrentUser = members.some((m) => m._id === currentUser._id);

  const getDisplayValue = () => {
    if (members.length === 0) return undefined;

    if (members.length === 1) {
      return isCurrentUser ? 'Current User' : members[0].details.fullName;
    }

    if (isCurrentUser) {
      const otherMembersCount = members.length - 1;
      if (otherMembersCount > 1) {
        return `You and ${otherMembersCount} others`;
      }

      const otherMember = members.find((m) => m._id !== currentUser._id);
      return `You and ${otherMember?.details.fullName}`;
    }

    return `${members.length} members`;
  };

  return (
    <Combobox.Value
      value={getDisplayValue()}
      loading={loading}
      placeholder={placeholder}
    />
  );
};

export const MembersInline = Object.assign(MembersInlineRoot, {
  Provider: MembersInlineProvider,
  Avatar: MembersInlineAvatar,
  Title: MembersInlineTitle,
});
