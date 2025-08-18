import {
  Avatar,
  AvatarProps,
  Combobox,
  Tooltip,
  cn,
  isUndefinedOrNull,
  readImage,
} from 'erxes-ui';
import {
  MembersInlineContext,
  useMembersInlineContext,
} from '../contexts/MembersInlineContext';
import { useEffect, useState } from 'react';

import { IUser } from '../types/TeamMembers';
import { IconUserCancel, IconUserCircle } from '@tabler/icons-react';
import { currentUserState } from 'ui-modules/states';
import { useAtomValue } from 'jotai';
import { useMemberInline } from '../hooks';

export const MembersInlineRoot = ({
  members,
  memberIds,
  placeholder,
  updateMembers,
  className,
  size,
}: {
  members?: IUser[];
  memberIds?: string[];
  placeholder?: string;
  updateMembers?: (members: IUser[]) => void;
  className?: string;
  size?: AvatarProps['size'];
}) => {
  return (
    <MembersInlineProvider
      members={members}
      memberIds={memberIds}
      placeholder={placeholder}
      updateMembers={updateMembers}
      size={size}
    >
      <MembersInlineAvatar size={size} />
      <MembersInlineTitle className={className} />
    </MembersInlineProvider>
  );
};

export const MembersInlineProvider = ({
  children,
  memberIds,
  members,
  placeholder,
  updateMembers,
  size,
}: {
  children?: React.ReactNode;
  memberIds?: string[];
  members?: IUser[];
  placeholder?: string;
  updateMembers?: (members: IUser[]) => void;
  size?: AvatarProps['size'];
}) => {
  const [_members, _setMembers] = useState<IUser[]>(members || []);

  return (
    <MembersInlineContext.Provider
      value={{
        members: members || _members,
        loading: false,
        memberIds: memberIds || [],
        placeholder: isUndefinedOrNull(placeholder)
          ? 'Select members'
          : placeholder,
        updateMembers: updateMembers || _setMembers,
        size,
      }}
    >
      <Tooltip.Provider>{children}</Tooltip.Provider>
      {memberIds
        ?.filter((id) => !members?.some((member) => member._id === id))
        .map((memberId) => (
          <MemberInlineEffectComponent key={memberId} memberId={memberId} />
        ))}
    </MembersInlineContext.Provider>
  );
};

const MemberInlineEffectComponent = ({ memberId }: { memberId: string }) => {
  const currentUser = useAtomValue(currentUserState) as IUser;
  const { members, memberIds, updateMembers } = useMembersInlineContext();
  const { userDetail } = useMemberInline({
    variables: {
      _id: memberId,
    },
    skip: !memberId || memberId === currentUser._id,
  });

  useEffect(() => {
    const newMembers = [...members].filter(
      (m) => memberIds?.includes(m._id) && m._id !== memberId,
    );
    if (newMembers.some((m) => m._id === memberId)) {
      updateMembers?.(newMembers);
      return;
    }
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

export const MembersInlineAvatar = ({
  className,
  containerClassName,
  ...props
}: AvatarProps & {
  containerClassName?: string;
}) => {
  const { members, loading, memberIds, size } = useMembersInlineContext();
  const currentUser = useAtomValue(currentUserState) as IUser;

  const sortedMembers = [...members].sort((a, b) => {
    if (a._id === currentUser?._id) return -1;
    if (b._id === currentUser?._id) return 1;
    return 0;
  });

  if (loading)
    return (
      <div className={cn('flex -space-x-1.5', containerClassName)}>
        {memberIds?.map((memberId) => (
          <Avatar key={memberId} className={cn('bg-background', className)}>
            <Avatar.Fallback />
          </Avatar>
        ))}
      </div>
    );

  const renderAvatar = (member: IUser) => {
    const { details } = member;
    const { avatar, fullName } = details || {};

    // if (member._id === currentUser._id) {
    //   return (
    //     <Tooltip delayDuration={100} key={member._id}>
    //       <Tooltip.Trigger asChild>
    //         <Avatar
    //           size={size || 'lg'}
    //           {...props}
    //           className={cn(className, 'items-center justify-center')}
    //         >
    //           <IconUserCircle className="text-accent-foreground size-4 flex-none" />
    //         </Avatar>
    //       </Tooltip.Trigger>
    //       <Tooltip.Content>
    //         <p>{currentUser.details?.fullName}</p>
    //       </Tooltip.Content>
    //     </Tooltip>
    //   );
    // }

    return (
      <Tooltip delayDuration={100} key={member._id}>
        <Tooltip.Trigger asChild>
          <Avatar
            className={cn(
              'bg-background',
              members.length > 1 && 'ring-2 ring-background',
              className,
            )}
            size={size || 'lg'}
            {...props}
          >
            <Avatar.Image src={readImage(avatar as string, 200)} />
            <Avatar.Fallback>{fullName?.charAt(0) || ''}</Avatar.Fallback>
          </Avatar>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>{fullName}</p>
        </Tooltip.Content>
      </Tooltip>
    );
  };

  if (members.length === 0)
    return (
      <IconUserCancel className="text-muted-foreground flex-none size-4" />
    );

  if (members.length === 1) return renderAvatar(members[0]);

  const withAvatar = sortedMembers.slice(0, sortedMembers.length > 3 ? 2 : 3);
  const restMembers = sortedMembers.slice(withAvatar.length);

  return (
    <div className="flex -space-x-1.5">
      {withAvatar.map((member) => renderAvatar(member))}
      {restMembers.length > 0 && (
        <Tooltip>
          <Tooltip.Trigger asChild>
            <Avatar
              className={cn('ring-2 ring-background bg-background', className)}
              size={size || 'lg'}
              {...props}
            >
              <Avatar.Fallback className="bg-primary/10 text-primary">
                +{restMembers.length}
              </Avatar.Fallback>
            </Avatar>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>{restMembers.map((m) => m.details?.fullName).join(', ')}</p>
          </Tooltip.Content>
        </Tooltip>
      )}
    </div>
  );
};

export const MembersInlineTitle = ({ className }: { className?: string }) => {
  const { members, loading, placeholder } = useMembersInlineContext();
  const currentUser = useAtomValue(currentUserState) as IUser;
  const isCurrentUser = members.some((m) => m._id === currentUser._id);

  const getDisplayValue = () => {
    if (!members || members.length === 0) return 'No assignee';

    if (members.length === 1) {
      return members?.[0].details?.fullName;
    }

    if (isCurrentUser) {
      const otherMembersCount = members.length - 1;
      if (otherMembersCount > 1) {
        return `You and ${otherMembersCount} others`;
      }

      const otherMember = members.find((m) => m._id !== currentUser._id);
      return `You and ${otherMember?.details?.fullName}`;
    }

    return `${members.length} members`;
  };

  return (
    <Combobox.Value
      value={getDisplayValue()}
      loading={loading}
      placeholder={placeholder}
      className={className}
    />
  );
};

export const MembersInline = Object.assign(MembersInlineRoot, {
  Provider: MembersInlineProvider,
  Avatar: MembersInlineAvatar,
  Title: MembersInlineTitle,
});
