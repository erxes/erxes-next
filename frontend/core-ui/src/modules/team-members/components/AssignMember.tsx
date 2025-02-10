import {
  Avatar,
  Button,
  ButtonProps,
  Command,
  Popover,
  Skeleton,
  Spinner,
} from 'erxes-ui/components';
import { useAssignedMember, useUsers } from '@/team-members/hooks/useUsers';
import { useState } from 'react';
import { IconCheck, IconChevronDown, IconLoader } from '@tabler/icons-react';
import { useDebounce } from 'use-debounce';
import { useInView } from 'react-intersection-observer';
import {
  AssignMemberFetchMoreProps,
  IAssignMember,
} from '../types/teamMembers';
import React from 'react';
import { cn } from 'erxes-ui/lib';

interface AssignMemberProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const AssignMember = React.forwardRef<
  React.RefObject<HTMLButtonElement>,
  ButtonProps & AssignMemberProps
>(({ value, onValueChange, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IAssignMember | undefined>(
    undefined,
  );

  const handleSelect = (user: IAssignMember | undefined) => {
    setSelectedUser(user);
    onValueChange(user?._id || '');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <AssignMemberTrigger
        value={value}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        {...props}
        ref={ref}
      />
      <Popover.Content className="p-0">
        <AssignMemberList
          renderItem={(user) => (
            <AssignMemberItem
              user={user}
              selectedUser={selectedUser}
              handleSelect={handleSelect}
            />
          )}
        />
      </Popover.Content>
    </Popover>
  );
});

export function AssignMemberList({
  renderItem,
}: {
  renderItem: (user: IAssignMember) => React.ReactNode;
}) {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const { users, loading, handleFetchMore, totalCount } = useUsers({
    variables: {
      searchValue: debouncedSearch,
    },
  });
  return (
    <Command shouldFilter={false}>
      <Command.Input
        value={search}
        onValueChange={setSearch}
        variant="secondary"
        wrapperClassName="flex-auto"
      />
      <Command.List className="max-h-[300px] overflow-y-auto">
        <AssignMemberEmpty loading={loading} />
        {users?.map((user) => renderItem(user))}
        <SelectUserFetchMore
          fetchMore={handleFetchMore}
          usersLength={users.length}
          totalCount={totalCount}
        />
      </Command.List>
    </Command>
  );
}

export const AssignMemberTrigger = React.forwardRef<
  React.RefObject<HTMLButtonElement>,
  ButtonProps & {
    value: string;
    selectedUser?: IAssignMember;
    setSelectedUser: (user?: IAssignMember) => void;
  }
>(({ value, selectedUser, setSelectedUser, className, ...props }, ref) => {
  const { loading } = useAssignedMember({
    variables: { id: value },
    skip: !value || !!selectedUser,
    onCompleted: ({ userDetail }) => {
      setSelectedUser({ ...userDetail, _id: value });
    },
  });

  return (
    <Popover.Trigger asChild>
      <Button
        variant="outline"
        role="combobox"
        className={cn(
          'truncate h-8 rounded-md hover:cursor-pointer shadow-none justify-start px-2  focus-visible:shadow-primary/10 focus-visible:ring-[3px] focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:outline-transparent',
          props.size === 'lg' && 'gap-2',
          className,
        )}
        disabled={loading}
        type="button"
        {...props}
        ref={ref as React.RefObject<HTMLButtonElement>}
      >
        {value ? (
          <AssignMemberInfo
            user={selectedUser}
            size={props.size as React.ComponentProps<typeof Avatar>['size']}
          />
        ) : loading ? (
          <Skeleton className="w-full h-8" />
        ) : (
          <span className="text-muted-foreground font-medium text-sm">
            Choose
          </span>
        )}
        {props.variant !== 'ghost' && (
          <IconChevronDown
            size={16}
            strokeWidth={2}
            className="shrink-0 text-muted-foreground ml-auto"
            aria-hidden="true"
          />
        )}
      </Button>
    </Popover.Trigger>
  );
});

export const AssignMemberEmpty = ({ loading }: { loading: boolean }) => {
  return (
    <Command.Empty>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Spinner size={'small'} />
        </div>
      ) : (
        <div>
          <p className="text-muted-foreground pb-2">No results found.</p>
        </div>
      )}
    </Command.Empty>
  );
};

export const AssignMemberItem = ({
  user,
  selectedUser,
  handleSelect,
}: {
  user: IAssignMember;
  selectedUser?: IAssignMember;
  handleSelect: (user?: IAssignMember) => void;
}) => {
  const isSelected = selectedUser?._id === user._id;
  return (
    <Command.Item
      key={user._id}
      value={user._id}
      onSelect={() => handleSelect(isSelected ? undefined : user)}
    >
      <AssignMemberInfo user={user} />
      {isSelected && (
        <IconCheck className="w-4 h-4 text-muted-foreground ml-auto" />
      )}
    </Command.Item>
  );
};

export const AssignMemberInfo = ({
  user,
  size,
}: {
  user?: IAssignMember;
  size?: React.ComponentProps<typeof Avatar>['size'];
}) => {
  return (
    <>
      <Avatar size={size}>
        <Avatar.Image src={user?.details?.avatar} />
        <Avatar.Fallback colorSeed={user?._id}>
          {user?.details?.fullName?.charAt(0)}
        </Avatar.Fallback>
      </Avatar>
      <span className="truncate">{user?.details?.fullName}</span>
    </>
  );
};

export function SelectUserFetchMore({
  fetchMore,
  usersLength,
  totalCount,
}: AssignMemberFetchMoreProps) {
  const { ref: bottomRef } = useInView({
    onChange: (inView) => inView && fetchMore(),
  });

  if (!usersLength || usersLength >= totalCount) {
    return null;
  }

  return (
    <Command.Item value="-" disabled ref={bottomRef}>
      <IconLoader className="w-4 h-4 animate-spin text-muted-foreground mr-1" />
      Load more...
    </Command.Item>
  );
}
