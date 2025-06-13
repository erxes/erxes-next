import { useState } from 'react';
import {
  SelectMemberContext,
  useSelectMemberContext,
} from '../contexts/SelectMemberContext';
import { IMember } from '../types/TeamMembers';
import { MembersInline } from './MembersInline';
import {
  cn,
  Combobox,
  Command,
  Filter,
  Form,
  Popover,
  RecordTableCellContent,
  RecordTableCellTrigger,
  RecordTablePopover,
  useFilterContext,
  useQueryState,
} from 'erxes-ui';
import { useDebounce } from 'use-debounce';
import { useUsers } from 'ui-modules/modules';
import { useAtomValue } from 'jotai';
import { currentUserState } from 'ui-modules/states';
import { IconUser } from '@tabler/icons-react';
import React from 'react';

const SelectMemberProvider = ({
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
  const [members, setMembers] = useState<IMember[]>([]);
  const isSingleMode = mode === 'single';

  const onSelect = (member: IMember) => {
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

    setMembers(members.filter((m) => newSelectedMemberIds.includes(m._id)));
    onValueChange?.(newSelectedMemberIds);
  };

  return (
    <SelectMemberContext.Provider
      value={{
        memberIds: !value ? [] : Array.isArray(value) ? value : [value],
        onSelect,
        members,
        setMembers,
        loading: false,
        error: null,
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
  size?: 'lg';
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

const SelectMemberCommandItem = ({ user }: { user: IMember }) => {
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
  const currentUser = useAtomValue(currentUserState) as IMember;
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

export const SelectMemberFilterView = () => {
  const [assignedTo, setAssignedTo] = useQueryState<string[]>('assignedTo');
  const { resetFilterState } = useFilterContext();

  return (
    <Filter.View filterKey="assignedTo">
      <SelectMember.Provider
        mode="multiple"
        value={assignedTo || []}
        onValueChange={(value) => {
          setAssignedTo(value as string[]);
          resetFilterState();
        }}
      >
        <SelectMember.Content />
      </SelectMember.Provider>
    </Filter.View>
  );
};

export const SelectMemberFilterBar = () => {
  const [assignedTo, setAssignedTo] = useQueryState<string[]>('assignedTo');
  const [open, setOpen] = useState(false);

  if (!assignedTo) {
    return null;
  }

  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconUser />
        Assigned To
      </Filter.BarName>
      <SelectMember.Provider
        mode="multiple"
        value={assignedTo || []}
        onValueChange={(value) => {
          if (value.length > 0) {
            setAssignedTo(value as string[]);
          } else {
            setAssignedTo(null);
          }
          setOpen(false);
        }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Filter.BarButton filterKey="assignedTo">
              <SelectMemberValue />
            </Filter.BarButton>
          </Popover.Trigger>
          <Combobox.Content>
            <SelectMember.Content />
          </Combobox.Content>
        </Popover>
      </SelectMember.Provider>
      <Filter.BarClose filterKey="assignedTo" />
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
        setOpen(false);
      }}
      {...props}
    >
      <RecordTablePopover open={open} onOpenChange={setOpen} scope={scope}>
        <RecordTableCellTrigger>
          <SelectMember.Value placeholder={''} />
        </RecordTableCellTrigger>
        <RecordTableCellContent>
          <SelectMember.Content />
        </RecordTableCellContent>
      </RecordTablePopover>
    </SelectMemberProvider>
  );
};

export const SelectMemberFormItem = ({
  onValueChange,
  className,
  ...props
}: Omit<React.ComponentProps<typeof SelectMemberProvider>, 'children'> & {
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectMember.Provider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Form.Control>
          <Combobox.Trigger className={cn('w-full shadow-xs', className)}>
            <SelectMember.Value />
          </Combobox.Trigger>
        </Form.Control>

        <Combobox.Content>
          <SelectMember.Content />
        </Combobox.Content>
      </Popover>
    </SelectMember.Provider>
  );
};

export const SelectMemberDetail = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<React.ComponentProps<typeof SelectMemberProvider>, 'children'> &
    React.ComponentProps<typeof Combobox.Trigger>
>(({ onValueChange, className, mode, value, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectMember.Provider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      mode={mode}
      value={value}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Combobox.Trigger
          ref={ref}
          className={cn('w-auto inline-flex', className)}
          variant="ghost"
          {...props}
        >
          <SelectMember.Value size="lg" />
        </Combobox.Trigger>
        <Combobox.Content>
          <SelectMember.Content />
        </Combobox.Content>
      </Popover>
    </SelectMember.Provider>
  );
});

export const SelectMember = {
  Provider: SelectMemberProvider,
  Value: SelectMemberValue,
  Content: SelectMemberContent,
  FilterItem: SelectMemberFilterItem,
  FilterView: SelectMemberFilterView,
  FilterBar: SelectMemberFilterBar,
  InlineCell: SelectMemberInlineCell,
  FormItem: SelectMemberFormItem,
  Detail: SelectMemberDetail,
};
