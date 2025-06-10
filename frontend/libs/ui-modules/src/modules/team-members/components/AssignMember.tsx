import {
  AvatarProps,
  ButtonProps,
  Combobox,
  Command,
  Popover,
  Skeleton,
} from 'erxes-ui';
import { useAssignedMember, useUsers } from '../hooks/useUsers';

import { IUser } from '../types/TeamMembers';
import { MemberInline } from './MemberInline';
import React from 'react';
import { useDebounce } from 'use-debounce';
import { useState } from 'react';

interface AssignMemberProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export const AssignMember = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  ButtonProps & AssignMemberProps
>(({ value, onValueChange, children, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | undefined>(
    undefined,
  );

  const handleSelect = (user?: IUser) => {
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

      <Combobox.Content>
        <AssignMemberList
          renderItem={(user) => (
            <AssignMemberItem
              key={user._id}
              user={user}
              isSelected={selectedUser?._id === user._id}
              handleSelect={handleSelect}
            />
          )}
        />
      </Combobox.Content>
    </Popover>
  );
});

export function AssignMemberList({
  renderItem,
  children,
  sort = true,
}: {
  renderItem: (user: IUser) => React.ReactNode;
  children?: React.ReactNode;
  sort?: boolean;
}) {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const { users, loading, handleFetchMore, totalCount, error } = useUsers({
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
      {children}
      <Command.List className="max-h-[300px] overflow-y-auto">
        <Combobox.Empty loading={loading} error={error} />
        {users?.map((user: IUser) => renderItem(user))}
        <Combobox.FetchMore
          fetchMore={handleFetchMore}
          currentLength={users.length}
          totalCount={totalCount}
        />
      </Command.List>
    </Command>
  );
}

export const AssignMemberTrigger = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  ButtonProps & {
    value: string;
    selectedUser?: IUser;
    setSelectedUser: (user?: IUser) => void;
  }
>(({ value, selectedUser, setSelectedUser, ...props }, ref) => {
  const { loading } = useAssignedMember({
    variables: { _id: value },
    skip: !value || selectedUser?._id === value,
    onCompleted: ({ userDetail }: { userDetail: IUser }) => {
      setSelectedUser({ ...userDetail, _id: value });
    },
  });

  return (
    <Combobox.Trigger disabled={loading} {...props} ref={ref}>
      {value ? (
        <MemberInline
          member={selectedUser}
          avatarProps={{
            size: props.size as AvatarProps['size'],
          }}
          className="overflow-hidden"
        />
      ) : loading ? (
        <Skeleton className="w-full h-8" />
      ) : (
        <Combobox.Value placeholder="Select user" />
      )}
    </Combobox.Trigger>
  );
});

export const AssignMemberItem = ({
  user,
  isSelected,
  handleSelect,
}: {
  user: IUser;
  isSelected: boolean;
  handleSelect: (user?: IUser) => void;
}) => {
  return (
    <Command.Item
      key={user._id}
      value={user._id}
      onSelect={() => handleSelect(user)}
    >
      <MemberInline member={user} />
      <Combobox.Check checked={isSelected} />
    </Command.Item>
  );
};
