import {
  cn,
  Combobox,
  Command,
  Popover,
  Skeleton,
  TextOverflowTooltip,
} from 'erxes-ui';
import React, { useState } from 'react';
import { IMemberGroup } from '../types/TeamMembers';
import { SelectUsersGroupContext } from '../contexts/SelectUsersGroupContext';
import { useSelectUsersGroupContext, useUsersGroup } from '../hooks';

type Props = {
  value?: string;
  onValueChange: (value: string) => void;
};

export const SelectUsersGroup = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  React.ComponentPropsWithoutRef<typeof Combobox.Trigger> & Props
>(({ value, onValueChange, ...props }, ref) => {
  const [_open, _setOpen] = useState(false);
  return (
    <SelectUsersGroupProvider>
      <Popover open={_open} onOpenChange={_setOpen}>
        <Combobox.Trigger
          {...props}
          ref={ref}
          className={cn('w-full flex text-left', props.className)}
        >
          <SelectUsersGroupValue value={value} />
        </Combobox.Trigger>
        <Combobox.Content>
          <UsersGroupsList
            renderItem={(usersGroup) => (
              <SelectUsersGroupItem
                key={usersGroup._id}
                usersGroup={usersGroup}
                onValueChange={(value) => {
                  onValueChange(value);
                  _setOpen(false);
                }}
              />
            )}
          />
        </Combobox.Content>
      </Popover>
    </SelectUsersGroupProvider>
  );
});

const SelectUsersGroupItem = ({
  usersGroup,
  onValueChange,
}: {
  usersGroup: IMemberGroup;
  onValueChange: (value: string) => void;
}) => {
  const { selectedUsersGroup, setSelectedUsersGroup } =
    useSelectUsersGroupContext();
  return (
    <Command.Item
      value={usersGroup.name}
      onSelect={() => {
        setSelectedUsersGroup(usersGroup);
        onValueChange(usersGroup._id);
      }}
    >
      <TextOverflowTooltip value={usersGroup.name} />
      <Combobox.Check checked={selectedUsersGroup?._id === usersGroup._id} />
    </Command.Item>
  );
};

const SelectUsersGroupProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedUsersGroup, setSelectedUsersGroup] = useState<
    IMemberGroup | undefined
  >(undefined);
  return (
    <SelectUsersGroupContext.Provider
      value={{ selectedUsersGroup, setSelectedUsersGroup }}
    >
      {children}
    </SelectUsersGroupContext.Provider>
  );
};

const SelectUsersGroupValue = ({ value }: { value?: string }) => {
  const { selectedUsersGroup } = useSelectUsersGroupContext();
  const { usersGroups, loading } = useUsersGroup();

  if (loading) return <Skeleton className="h-4 w-32 overflow-hidden" />;
  const usersGroup = usersGroups?.find(
    (group: IMemberGroup) => group._id === value,
  );
  return (
    <Combobox.Value
      placeholder="Select Group"
      value={selectedUsersGroup?.name || usersGroup?.name}
    />
  );
};

export const UsersGroupsList = ({
  renderItem,
}: {
  renderItem: (usersGroup: IMemberGroup) => React.ReactNode;
}) => {
  const { usersGroups, loading } = useUsersGroup();
  return (
    <Command>
      <Command.List>
        <Combobox.Empty loading={loading} />
        {usersGroups?.map((usersGroup: IMemberGroup) => renderItem(usersGroup))}
      </Command.List>
    </Command>
  );
};
