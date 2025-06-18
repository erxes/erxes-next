import { Avatar, Combobox, Skeleton } from 'erxes-ui';

import { IUser } from '../types/TeamMembers';
import { MemberListInlineContext } from '../contexts/MemberListInlineContext';
import React from 'react';
import { useMemberListContext } from '../hooks/useMemberListContext';
import { useUsers } from '../hooks';

export const MemberListInlineRoot = ({
  members,
  memberIds,
}: {
  members?: IUser[];
  memberIds?: string[];
}) => {
  return (
    <MemberListInlineProvider members={members} memberIds={memberIds}>
      <span className="inline-flex items-center gap-2 overflow-hidden">
        <MemberListInlineAvatars />
        <MemberListInlineTitle />
      </span>
    </MemberListInlineProvider>
  );
};

export const MemberListInlineProvider = ({
  children,
  members,
  memberIds,
}: {
  children: React.ReactNode;
  members?: IUser[];
  memberIds?: string[];
}) => {
  const { users, loading } = useUsers({
    variables: {
      ids: memberIds,
    },
    skip:
      !memberIds || memberIds.length === 0 || (members && members.length > 0),
  });

  return (
    <MemberListInlineContext.Provider
      value={{ members: members || users, memberIds, loading }}
    >
      {children}
    </MemberListInlineContext.Provider>
  );
};

export const MemberListInlineAvatars = () => {
  const { members, loading } = useMemberListContext();

  if (loading) {
    return <Skeleton className="w-10 h-10 rounded-full" />;
  }

  if (members.length === 0) {
    return null;
  }

  const withAvatar = members.slice(0, members.length > 3 ? 2 : 3);

  return (
    <div className="flex -space-x-1.5">
      {withAvatar.map((member) => (
        <Avatar
          size="lg"
          className="ring-2 ring-background bg-background"
          key={member._id}
        >
          <Avatar.Image src={member.details.avatar} />
          <Avatar.Fallback>{member.details.fullName.charAt(0)}</Avatar.Fallback>
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

export const MemberListInlineTitle = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(({ className, ...props }, ref) => {
  const { members, loading } = useMemberListContext();

  if (loading) {
    return <Skeleton className="w-20 h-4 rounded-md" />;
  }

  const displayValue =
    members.length > 0
      ? members.length === 1
        ? members[0].details.fullName
        : `${members.length} members`
      : undefined;

  return (
    <Combobox.Value
      ref={ref}
      className={className}
      {...props}
      placeholder="Select members"
      value={displayValue}
    />
  );
});

MemberListInlineTitle.displayName = 'MemberListInlineTitle';

export const MemberListInline = Object.assign(MemberListInlineRoot, {
  Provider: MemberListInlineProvider,
  Avatars: MemberListInlineAvatars,
  Title: MemberListInlineTitle,
});
