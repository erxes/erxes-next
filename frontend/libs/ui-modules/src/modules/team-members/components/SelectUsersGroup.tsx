import {
  Combobox,
  Command,
  Filter,
  Form,
  Popover,
  Skeleton,
  TextOverflowTooltip,
  cn,
  useFilterContext,
  useQueryState,
} from 'erxes-ui';
import React, { useState } from 'react';
import { useSelectUsersGroupContext, useUsersGroup } from '../hooks';

import { IUserGroup } from '../types/TeamMembers';
import { SelectUsersGroupContext } from '../contexts/SelectUsersGroupContext';
import { GroupsInline } from 'ui-modules/modules/team-members/components/GroupsInline';
import { IconUsers } from '@tabler/icons-react';

type Props = {
  value?: string;
  onValueChange: (value: string) => void;
};

const SelectUsersGroupProvider = ({
  children,
  mode = 'single',
  value,
  onValueChange,
}: {
  children: React.ReactNode;
  mode?: 'single' | 'multiple';
  value?: string[] | string;
  onValueChange?: (value: string[] | string) => void;
}) => {
  const [usersGroups, setUsersGroups] = useState<IUserGroup[]>([]);
  const isSingleMode = mode === 'single';

  const onSelect = (group: IUserGroup) => {
    if (!group) {
      return;
    }

    if (isSingleMode) {
      setUsersGroups([group]);
      return onValueChange?.(group._id);
    }
    const arrayValue = Array.isArray(value) ? value : [];

    const isGroupSelected = arrayValue.includes(group._id);
    const newSelectedGroupIds = isGroupSelected
      ? arrayValue.filter((id) => id !== group._id)
      : [...arrayValue, group._id];

    setUsersGroups(
      usersGroups.filter((g) => newSelectedGroupIds.includes(g._id)),
    );
    onValueChange?.(newSelectedGroupIds);
  };

  return (
    <SelectUsersGroupContext.Provider
      value={{
        usersGroups,
        setUsersGroups,
        groupsIds: !value ? [] : Array.isArray(value) ? value : [value],
        onSelect,
        loading: false,
        error: null,
      }}
    >
      {children}
    </SelectUsersGroupContext.Provider>
  );
};

const SelectUsersGroupValue = ({ value }: { value?: string }) => {
  const { usersGroups, groupsIds, setUsersGroups } =
    useSelectUsersGroupContext();

  return (
    <GroupsInline
      groups={usersGroups}
      groupsIds={groupsIds}
      updateGroups={setUsersGroups}
    />
  );
};

export const UsersGroupContent = () => {
  const { groupsIds, onSelect } = useSelectUsersGroupContext();
  const {
    usersGroups: groupsData,
    loading,
    totalCount,
    error,
    handleFetchMore,
  } = useUsersGroup();
  return (
    <Command shouldFilter={false}>
      <Command.Input
        variant="secondary"
        focusOnMount
        placeholder="Search groups"
      />

      <Command.List className="max-h-[300px] overflow-y-auto">
        <Combobox.Empty loading={loading} error={error} />
        {groupsData && groupsData?.length > 0 && (
          <>
            {groupsData.map((group) => (
              <Command.Item
                key={group._id}
                value={group._id}
                onSelect={() => onSelect(group)}
              >
                {group.name}
                <Combobox.Check checked={groupsIds.includes(group._id)} />
              </Command.Item>
            ))}

            <Combobox.FetchMore
              fetchMore={handleFetchMore}
              currentLength={groupsData.length}
              totalCount={totalCount || 0}
            />
          </>
        )}
      </Command.List>
    </Command>
  );
};

export const SelectUsersGroupFormItem = ({
  className,
  ...props
}: Omit<React.ComponentProps<typeof SelectUsersGroupProvider>, 'children'> & {
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectUsersGroupProvider {...props}>
      <Popover open={open} onOpenChange={setOpen}>
        <Form.Control>
          <Combobox.Trigger className={cn('w-full', className)}>
            <SelectUsersGroupValue />
          </Combobox.Trigger>
        </Form.Control>

        <Combobox.Content>
          <UsersGroupContent />
        </Combobox.Content>
      </Popover>
    </SelectUsersGroupProvider>
  );
};

const SelectUsersGroupsFilterItem = () => {
  return (
    <Filter.Item filterKey={'groupId'}>
      <IconUsers />
      Users group
    </Filter.Item>
  );
};

const SelectUsersGroupFilterView = () => {
  const [groupId, setGroupId] = useQueryState<string>('groupId');
  const { resetFilterState } = useFilterContext();

  return (
    <Filter.View filterKey="channelId">
      <SelectUsersGroupProvider
        value={groupId || []}
        onValueChange={(value) => {
          setGroupId(value as string);
          resetFilterState();
        }}
      >
        <UsersGroupContent />
      </SelectUsersGroupProvider>
    </Filter.View>
  );
};

export const SelectUsersGroupBar = () => {
  const [groupId, setGroupId] = useQueryState<string>('groupId');
  const [open, setOpen] = useState(false);

  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconUsers />
        Users group
      </Filter.BarName>
      <SelectUsersGroupProvider
        value={groupId || []}
        onValueChange={(value) => {
          if (value.length > 0) {
            setGroupId(value as string);
          } else {
            setGroupId(null);
          }
          setOpen(false);
        }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Filter.BarButton filterKey="groupId" className="rounded-l">
              <SelectUsersGroupValue />
            </Filter.BarButton>
          </Popover.Trigger>
          <Combobox.Content>
            <UsersGroupContent />
          </Combobox.Content>
        </Popover>
      </SelectUsersGroupProvider>
      <Filter.BarClose filterKey="groupId" />
    </Filter.BarItem>
  );
};

export const SelectUsersGroup = {
  Value: SelectUsersGroupValue,
  Content: UsersGroupContent,
  Provider: SelectUsersGroupProvider,
  FormItem: SelectUsersGroupFormItem,
  FilterItem: SelectUsersGroupsFilterItem,
  FilterView: SelectUsersGroupFilterView,
  FilterBar: SelectUsersGroupBar,
};
