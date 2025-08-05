import {
  Button,
  Combobox,
  Command,
  Filter,
  Form,
  Popover,
  RecordTableCellContent,
  RecordTableCellTrigger,
  RecordTablePopover,
  cn,
  useFilterContext,
  useQueryState,
} from 'erxes-ui';
import {
  SelectMemberContext,
  useSelectMemberContext,
} from '../contexts/SelectMemberContext';

import { IUser } from '../types/TeamMembers';
import { IconPlus, IconUser } from '@tabler/icons-react';
import { MembersInline } from './MembersInline';
import React from 'react';
import { currentUserState } from 'ui-modules/states';
import { useAtomValue } from 'jotai';
import { useDebounce } from 'use-debounce';
import { useState } from 'react';
import { useUsers } from 'ui-modules/modules';

const SelectMemberProvider = ({
  children,
  mode = 'single',
  value,
  onValueChange,
  members,
}: {
  children: React.ReactNode;
  mode?: 'single' | 'multiple';
  value?: string[] | string;
  onValueChange?: (value: string[] | string) => void;
  members?: IUser[];
}) => {
  const [_members, setMembers] = useState<IUser[]>(members || []);
  const isSingleMode = mode === 'single';

  const onSelect = (member: IUser) => {
    if (!member) return;
    if (isSingleMode) {
      setMembers([member]);
      return onValueChange?.(member._id);
    }
    const arrayValue = Array.isArray(value) ? value : [];

    const isMemberSelected = arrayValue.includes(member._id);
    const newSelectedMemberIds = isMemberSelected
      ? arrayValue.filter((id) => id !== member._id)
      : [...arrayValue, member._id];

    setMembers((prev) =>
      [...prev, member].filter((m) => newSelectedMemberIds.includes(m._id)),
    );
    onValueChange?.(newSelectedMemberIds);
  };

  return (
    <SelectMemberContext.Provider
      value={{
        memberIds: !value ? [] : Array.isArray(value) ? value : [value],
        onSelect,
        members: _members,
        setMembers,
        loading: _members.length !== value?.length,
      }}
    >
      {children}
    </SelectMemberContext.Provider>
  );
};

const SelectMemberValue = ({
  placeholder,
  size,
}: {
  placeholder?: string;
  size?: 'lg' | 'sm' | 'xl' | 'default' | 'xs';
}) => {
  const { memberIds, members, setMembers } = useSelectMemberContext();

  return (
    <MembersInline
      memberIds={memberIds}
      members={members}
      updateMembers={setMembers}
      placeholder={placeholder}
      size={size}
    />
  );
};

const SelectMemberCommandItem = ({ user }: { user: IUser }) => {
  const { onSelect, memberIds } = useSelectMemberContext();

  return (
    <Command.Item
      value={user._id}
      onSelect={() => {
        onSelect(user);
      }}
    >
      <MembersInline
        members={[
          {
            ...user,
          },
        ]}
        placeholder="Unnamed user"
      />
      <Combobox.Check checked={memberIds.includes(user._id)} />
    </Command.Item>
  );
};

const SelectMemberContent = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const currentUser = useAtomValue(currentUserState) as IUser;
  const { memberIds, members } = useSelectMemberContext();
  const { users, loading, handleFetchMore, totalCount, error } = useUsers({
    variables: {
      searchValue: debouncedSearch,
      excludeIds: true,
      ids: [currentUser?._id],
    },
  });

  return (
    <Command shouldFilter={false}>
      <Command.Input
        value={search}
        onValueChange={setSearch}
        variant="secondary"
        wrapperClassName="flex-auto"
        focusOnMount
      />
      <Command.List className="max-h-[300px] overflow-y-auto">
        <Combobox.Empty loading={loading} error={error} />
        {members.length > 0 && (
          <>
            {members.map((member) => (
              <SelectMemberCommandItem key={member._id} user={member} />
            ))}
            <Command.Separator className="my-1" />
          </>
        )}

        {!loading &&
          [currentUser, ...users]
            .filter(
              (user) => !memberIds.find((memberId) => memberId === user._id),
            )
            .map((user) => (
              <SelectMemberCommandItem key={user._id} user={user} />
            ))}

        <Combobox.FetchMore
          fetchMore={handleFetchMore}
          currentLength={users.length}
          totalCount={totalCount}
        />
      </Command.List>
    </Command>
  );
};

export const SelectMemberFilterItem = () => {
  return (
    <Filter.Item value="assignedTo">
      <IconUser />
      Assigned To
    </Filter.Item>
  );
};

export const SelectMemberFilterView = ({
  onValueChange,
  queryKey,
  mode = 'single',
}: {
  onValueChange?: (value: string[] | string) => void;
  queryKey?: string;
  mode?: 'single' | 'multiple';
}) => {
  const [assignedTo, setAssignedTo] = useQueryState<string[] | string>(
    queryKey || 'assignedTo',
  );
  const { resetFilterState } = useFilterContext();

  return (
    <Filter.View filterKey={queryKey || 'assignedTo'}>
      <SelectMemberProvider
        mode={mode}
        value={assignedTo || (mode === 'single' ? '' : [])}
        onValueChange={(value) => {
          setAssignedTo(value as string[] | string);
          resetFilterState();
          onValueChange?.(value);
        }}
      >
        <SelectMemberContent />
      </SelectMemberProvider>
    </Filter.View>
  );
};

export const SelectMemberFilterBar = ({
  iconOnly,
  onValueChange,
  queryKey,
  mode = 'single',
}: {
  iconOnly?: boolean;
  onValueChange?: (value: string[] | string) => void;
  queryKey?: string;
  mode?: 'single' | 'multiple';
}) => {
  const [assignedTo, setAssignedTo] = useQueryState<string[] | string>(
    queryKey || 'assignedTo',
  );
  const [open, setOpen] = useState(false);

  if (!assignedTo) {
    return null;
  }

  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconUser />
        {!iconOnly && 'Assigned To'}
      </Filter.BarName>
      <SelectMemberProvider
        mode={mode}
        value={assignedTo || (mode === 'single' ? '' : [])}
        onValueChange={(value) => {
          if (value.length > 0) {
            setAssignedTo(value as string[] | string);
          } else {
            setAssignedTo(null);
          }
          setOpen(false);
          onValueChange?.(value);
        }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Filter.BarButton filterKey={queryKey || 'assignedTo'}>
              <SelectMemberValue />
            </Filter.BarButton>
          </Popover.Trigger>
          <Combobox.Content>
            <SelectMemberContent />
          </Combobox.Content>
        </Popover>
      </SelectMemberProvider>
      <Filter.BarClose filterKey={queryKey || 'assignedTo'} />
    </Filter.BarItem>
  );
};

export const SelectMemberInlineCell = ({
  onValueChange,
  scope,
  ...props
}: Omit<React.ComponentProps<typeof SelectMemberProvider>, 'children'> & {
  scope?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectMemberProvider
      onValueChange={(value) => {
        onValueChange?.(value);
      }}
      {...props}
    >
      <RecordTablePopover open={open} onOpenChange={setOpen} scope={scope}>
        <RecordTableCellTrigger>
          <SelectMemberValue placeholder={''} />
        </RecordTableCellTrigger>
        <RecordTableCellContent>
          <SelectMemberContent />
        </RecordTableCellContent>
      </RecordTablePopover>
    </SelectMemberProvider>
  );
};

export const SelectMemberFormItem = ({
  onValueChange,
  className,
  placeholder,
  ...props
}: Omit<React.ComponentProps<typeof SelectMemberProvider>, 'children'> & {
  className?: string;
  placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectMemberProvider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Form.Control>
          <Combobox.Trigger className={cn('w-full shadow-xs', className)}>
            <SelectMemberValue placeholder={placeholder} />
          </Combobox.Trigger>
        </Form.Control>

        <Combobox.Content>
          <SelectMemberContent />
        </Combobox.Content>
      </Popover>
    </SelectMemberProvider>
  );
};

export const SelectMemberDetail = ({
  onValueChange,
  className,
  size = 'xl',
  placeholder,
  value,
  ...props
}: Omit<
  React.ComponentProps<typeof SelectMemberProvider>,
  'children' | 'value'
> & {
  className?: string;
  size?: 'lg' | 'sm' | 'xl' | 'default' | 'xs';
  placeholder?: string;
  value: string | null | undefined;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectMemberProvider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Popover.Trigger>
          {!value ? (
            <Button
              className={cn(
                'w-min inline-flex text-sm font-medium ',
                className,
              )}
              variant="outline"
            >
              Add Owner <IconPlus />
            </Button>
          ) : (
            <Button variant="ghost" className="px-0 h-8">
              <SelectMemberValue size={size} />
            </Button>
          )}
        </Popover.Trigger>
        <Combobox.Content>
          <SelectMemberContent />
        </Combobox.Content>
      </Popover>
    </SelectMemberProvider>
  );
};

export const SelectMemberRoot = ({
  onValueChange,
  className,
  size,
  placeholder,
  ...props
}: Omit<React.ComponentProps<typeof SelectMemberProvider>, 'children'> & {
  className?: string;
  size?: 'lg' | 'sm' | 'xl' | 'default' | 'xs';
  placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectMemberProvider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Combobox.Trigger
          className={cn('w-full inline-flex', className)}
          variant="outline"
        >
          <SelectMemberValue size={size} placeholder={placeholder} />
        </Combobox.Trigger>
        <Combobox.Content>
          <SelectMemberContent />
        </Combobox.Content>
      </Popover>
    </SelectMemberProvider>
  );
};

export const SelectMember = Object.assign(SelectMemberRoot, {
  Provider: SelectMemberProvider,
  Value: SelectMemberValue,
  Content: SelectMemberContent,
  FilterItem: SelectMemberFilterItem,
  FilterView: SelectMemberFilterView,
  FilterBar: SelectMemberFilterBar,
  InlineCell: SelectMemberInlineCell,
  FormItem: SelectMemberFormItem,
  Detail: SelectMemberDetail,
});
