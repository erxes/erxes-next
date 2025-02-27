import React from 'react';
import { IMember } from '../types/TeamMembers';
import { Avatar, avatarVariants, cn, Skeleton, Tooltip } from 'erxes-ui';
import { useMemberInlineContext } from '../hooks/useMemberInline';
import { Slot } from '@radix-ui/react-slot';
import { useAssignedMember } from '../hooks/useUsers';
import { MemberInlineContext } from '../contexts/MemberInlineContext';

export const MemberInlineRoot = React.forwardRef<
  HTMLSpanElement,
  Omit<React.ComponentPropsWithoutRef<'span'>, 'children'> & {
    member?: IMember;
    memberId?: string;
    avatarProps?: React.ComponentPropsWithoutRef<typeof Avatar>;
  }
>(({ member, memberId, avatarProps, className, ...props }, ref) => {
  return (
    <MemberInlineProvider memberId={memberId} member={member}>
      <span
        className={cn('inline-flex items-center gap-1', className)}
        ref={ref}
        {...props}
      >
        <MemberInline.Avatar {...avatarProps} />
        <MemberInline.Title />
      </span>
    </MemberInlineProvider>
  );
});

MemberInlineRoot.displayName = 'MemberInlineRoot';

const MemberInlineProvider = ({
  children,
  member,
  memberId,
}: {
  children: React.ReactNode;
  member?: IMember;
  memberId?: string;
}) => {
  const { details, loading } = useAssignedMember({
    variables: {
      _id: memberId,
    },
    skip: !memberId,
  });

  const memberData = member?.details || details || {};

  return (
    <MemberInlineContext.Provider
      value={{ ...memberData, loading, _id: memberId || member?._id }}
    >
      {children}
    </MemberInlineContext.Provider>
  );
};

export const MemberInlineAvatar = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  React.ComponentPropsWithoutRef<typeof Avatar> & {
    showTooltip?: boolean;
  }
>(({ showTooltip, ...props }, ref) => {
  const { avatar, fullName, loading, _id } = useMemberInlineContext();

  if (loading)
    return <Skeleton className={avatarVariants({ size: props.size })} />;

  return (
    <Tooltip.Provider>
      <Tooltip delayDuration={100}>
        <Tooltip.Trigger asChild>
          <Avatar {...props} ref={ref}>
            <Avatar.Image src={avatar} />
            <Avatar.Fallback colorSeed={_id}>
              {fullName?.charAt(0) || ''}
            </Avatar.Fallback>
          </Avatar>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>{fullName}</p>
        </Tooltip.Content>
      </Tooltip>
    </Tooltip.Provider>
  );
});

MemberInlineAvatar.displayName = 'MemberInlineAvatar';

export const MemberInlineTitle = React.forwardRef<
  HTMLSpanElement,
  Omit<React.ComponentPropsWithoutRef<'span'>, 'children'> & {
    asChild?: boolean;
  }
>(({ asChild, ...props }, ref) => {
  const { fullName, loading } = useMemberInlineContext();

  if (loading) return <Skeleton className="w-20 h-4" />;

  const Comp = asChild ? Slot : 'span';

  return (
    <Comp ref={ref} {...props}>
      {fullName}
    </Comp>
  );
});

MemberInlineTitle.displayName = 'MemberInlineTitle';

export const MemberInline = Object.assign(MemberInlineRoot, {
  Provider: MemberInlineProvider,
  Avatar: MemberInlineAvatar,
  Title: MemberInlineTitle,
});
