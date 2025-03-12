import {
  AvatarProps,
  ButtonProps,
  Combobox,
  Command,
  Popover,
  Skeleton,
  Spinner,
} from 'erxes-ui';
import { useAssignedMember, useUsers } from '../hooks/useUsers';
import { useState } from 'react';
import { IconCheck, IconLoader } from '@tabler/icons-react';
import { useDebounce } from 'use-debounce';
import { useInView } from 'react-intersection-observer';
import { AssignMemberFetchMoreProps, IMember } from '../types/TeamMembers';
import React from 'react';
import { MemberInline } from './MemberInline';

interface AssignMemberProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export const AssignMember = React.forwardRef<
  React.ElementRef<typeof Combobox>,
  ButtonProps & AssignMemberProps
>(({ value, onValueChange, children, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IMember | undefined>(
    undefined,
  );

  const handleSelect = (user: IMember | undefined) => {
    setSelectedUser(user);
    onValueChange?.(user?._id || '');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      {children ? (
        children
      ) : (
        <AssignMemberTrigger
          value={value || ''}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          {...props}
          ref={ref}
        />
      )}

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
  renderItem: (user: IMember) => React.ReactNode;
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
        {users?.map((user: IMember) => renderItem(user))}
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
  React.ElementRef<typeof Combobox>,
  ButtonProps & {
    value: string;
    selectedUser?: IMember;
    setSelectedUser: (user?: IMember) => void;
  }
>(({ value, selectedUser, setSelectedUser, ...props }, ref) => {
  const { loading } = useAssignedMember({
    variables: { _id: value },
    skip: !value || selectedUser?._id === value,
    onCompleted: ({ userDetail }: { userDetail: IMember }) => {
      setSelectedUser({ ...userDetail, _id: value });
    },
  });

  return (
    <Popover.Trigger asChild>
      <Combobox disabled={loading} {...props} ref={ref}>
        {value ? (
          <MemberInline
            member={selectedUser}
            avatarProps={{
              size: props.size as AvatarProps['size'],
            }}
          />
        ) : loading ? (
          <Skeleton className="w-full h-8" />
        ) : (
          <span className="text-muted-foreground font-medium text-sm">
            Choose
          </span>
        )}
      </Combobox>
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
  user: IMember;
  selectedUser?: IMember;
  handleSelect: (user?: IMember) => void;
}) => {
  const isSelected = selectedUser?._id === user._id;
  return (
    <Command.Item
      key={user._id}
      value={user._id}
      onSelect={() => handleSelect(isSelected ? undefined : user)}
    >
      <MemberInline member={user} />
      {isSelected && (
        <IconCheck className="w-4 h-4 text-muted-foreground ml-auto" />
      )}
    </Command.Item>
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
