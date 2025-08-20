import React, { useState } from 'react';
import { useGetCurrentUsersTeams } from '@/team/hooks/useGetCurrentUsersTeams';
import {
  Button,
  cn,
  Combobox,
  Command,
  Filter,
  Form,
  Popover,
  PopoverScoped,
  RecordTableInlineCell,
  useFilterContext,
  useQueryState,
} from 'erxes-ui';
import {
  useUsers,
  SelectMember,
  currentUserState,
  IUser,
  useSelectMemberContext,
  MembersInline,
} from 'ui-modules';
import { useAtomValue } from 'jotai';
import { useGetTeamMembers } from '@/team/hooks/useGetTeamMembers';
import { useDebounce } from 'use-debounce';
import { IconUser } from '@tabler/icons-react';
import { useUpdateTask } from '@/task/hooks/useUpdateTask';

export const SelectAssigneeProvider = SelectMember.Provider;

const SelectAssigneeValue = ({ placeholder }: { placeholder?: string }) => {
  return <SelectMember.Value placeholder={placeholder} />;
};

export const SelectTeamMemberContent = ({
  teamIds,
  exclude,
}: {
  teamIds?: string[] | string;
  exclude: boolean;
}) => {
  const { members: teamMembers } = useGetTeamMembers({ teamIds });
  const excludeIds = teamMembers?.map((member) => member.memberId);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const currentUser = useAtomValue(currentUserState) as IUser;
  const { memberIds, members } = useSelectMemberContext();
  const filteredIds = excludeIds?.filter((id) => id !== currentUser._id);
  const { users, loading, handleFetchMore, totalCount, error } = useUsers({
    variables: {
      searchValue: debouncedSearch,
      excludeIds: exclude,
      ids: filteredIds,
    },
    skip: !excludeIds || !filteredIds?.length,
  });
  const membersList = exclude
    ? [currentUser, ...users].filter(
        (user) =>
          !memberIds?.find((memberId) => memberId === user._id) &&
          !excludeIds?.find((excludeId) => excludeId === user._id),
      )
    : [currentUser, ...users].filter(
        (user) => !members.find((member) => member._id === user._id),
      );
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
              <SelectMember.CommandItem key={member._id} user={member} />
            ))}
            {!loading && membersList.length > 0 && (
              <Command.Separator className="my-1" />
            )}
          </>
        )}

        {!loading && <SelectMember.NoAssigneeItem />}
        {!loading &&
          membersList.map((user: IUser) => (
            <SelectMember.CommandItem key={user._id} user={user} />
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

const SelectAssigneeContent = ({
  teamIds,
}: {
  teamIds?: string[] | string;
}) => {
  return <SelectTeamMemberContent teamIds={teamIds} exclude={false} />;
};

export const SelectAssigneeFilterItem = () => {
  return (
    <Filter.Item value="assignee">
      <IconUser />
      Assignee
    </Filter.Item>
  );
};

export const SelectAssigneeFilterView = ({
  onValueChange,
  queryKey,
}: {
  onValueChange?: (value: string) => void;
  queryKey?: string;
}) => {
  const [assignee, setAssignee] = useQueryState<string>(queryKey || 'assignee');
  const { resetFilterState } = useFilterContext();
  const { teams } = useGetCurrentUsersTeams();

  return (
    <Filter.View filterKey={queryKey || 'assignee'}>
      <SelectAssigneeProvider
        mode="single"
        value={assignee || ''}
        onValueChange={(value) => {
          setAssignee(value as string);
          resetFilterState();
          onValueChange?.(value as string);
        }}
      >
        <SelectAssigneeContent teamIds={teams?.map((team) => team._id)} />
      </SelectAssigneeProvider>
    </Filter.View>
  );
};

export const SelectAssigneeFilterBar = ({
  iconOnly,
  onValueChange,
  queryKey,
  teamIds,
}: {
  iconOnly?: boolean;
  onValueChange?: (value: string) => void;
  queryKey?: string;
  teamIds?: string[] | string;
}) => {
  const [assignee, setAssignee] = useQueryState<string>(queryKey || 'assignee');
  const [open, setOpen] = useState(false);

  if (!assignee) {
    return null;
  }

  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconUser />
        {!iconOnly && 'Assignee'}
      </Filter.BarName>
      <SelectAssigneeProvider
        mode="single"
        value={assignee || ''}
        onValueChange={(value) => {
          if (value) {
            setAssignee(value as string);
          } else {
            setAssignee(null);
          }
          setOpen(false);
          onValueChange?.(value as string);
        }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Filter.BarButton filterKey={queryKey || 'assignee'}>
              <SelectAssigneeValue />
            </Filter.BarButton>
          </Popover.Trigger>
          <Combobox.Content>
            <SelectAssigneeContent teamIds={teamIds} />
          </Combobox.Content>
        </Popover>
      </SelectAssigneeProvider>
      <Filter.BarClose filterKey={queryKey || 'assignee'} />
    </Filter.BarItem>
  );
};

export const SelectAssigneeInlineCell = ({
  teamIds,
  value,
  id,
  onValueChange,
  scope,
  ...props
}: {
  teamIds?: string[] | string;
  value?: string;
  id?: string;
  onValueChange?: (value: string | string[] | null) => void;
  scope?: string;
} & Omit<
  React.ComponentProps<typeof SelectAssigneeProvider>,
  'children' | 'onValueChange' | 'value'
>) => {
  const { updateTask } = useUpdateTask();
  const [open, setOpen] = useState(false);

  const handleValueChange = (value: string | string[] | null) => {
    if (id) {
      updateTask({
        variables: {
          _id: id,
          assigneeId: value,
        },
      });
    }
    onValueChange?.(value);
    setOpen(false);
  };

  return (
    <SelectAssigneeProvider
      mode="single"
      value={value || ''}
      onValueChange={handleValueChange}
      {...props}
    >
      <PopoverScoped open={open} onOpenChange={setOpen} scope={scope}>
        <RecordTableInlineCell.Trigger className="font-medium">
          <SelectAssigneeValue placeholder="Assignee not specified" />
        </RecordTableInlineCell.Trigger>
        <RecordTableInlineCell.Content>
          <SelectAssigneeContent teamIds={teamIds} />
        </RecordTableInlineCell.Content>
      </PopoverScoped>
    </SelectAssigneeProvider>
  );
};

const SelectAssigneeFormValue = () => {
  const { members, memberIds, setMembers } = useSelectMemberContext();
  if (memberIds?.length === 0)
    return (
      <span className="flex items-center gap-2">
        <IconUser className="size-4" />
        <p className="text-muted-foreground font-medium text-base">Assignee</p>
      </span>
    );

  return (
    <MembersInline
      memberIds={memberIds}
      members={members}
      updateMembers={setMembers}
      className="font-medium text-base text-foreground"
    />
  );
};

export const SelectAssigneeFormItem = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<React.ComponentProps<typeof SelectAssigneeProvider>, 'children'> & {
    className?: string;
    teamIds?: string[] | string;
  }
>(({ onValueChange, className, teamIds, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectAssigneeProvider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Form.Control>
          <Combobox.TriggerBase
            ref={ref}
            className={cn('w-full shadow-xs', className)}
            asChild
          >
            <Button variant="secondary" className="h-7">
              <SelectAssigneeFormValue />
            </Button>
          </Combobox.TriggerBase>
        </Form.Control>
        <Combobox.Content>
          <SelectAssigneeContent teamIds={teamIds} />
        </Combobox.Content>
      </Popover>
    </SelectAssigneeProvider>
  );
});

SelectAssigneeFormItem.displayName = 'SelectAssigneeFormItem';

const SelectAssigneeRoot = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<React.ComponentProps<typeof SelectAssigneeProvider>, 'children'> &
    React.ComponentProps<typeof Combobox.Trigger> & {
      placeholder?: string;
      teamIds?: string[] | string;
    }
>(
  (
    { onValueChange, className, mode, value, placeholder, teamIds, ...props },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    return (
      <SelectAssigneeProvider
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
            className={cn('w-full inline-flex', className)}
            variant="outline"
            {...props}
          >
            <SelectAssigneeValue placeholder={placeholder} />
          </Combobox.Trigger>
          <Combobox.Content>
            <SelectAssigneeContent teamIds={teamIds} />
          </Combobox.Content>
        </Popover>
      </SelectAssigneeProvider>
    );
  },
);

SelectAssigneeRoot.displayName = 'SelectAssigneeRoot';

export const SelectAssigneeDetail = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<React.ComponentProps<typeof SelectAssigneeProvider>, 'children'> & {
    className?: string;
    placeholder?: string;
    teamIds?: string[] | string;
    id?: string;
  }
>(({ onValueChange, className, placeholder, teamIds, id, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const { updateTask } = useUpdateTask();

  const handleValueChange = (value: string | string[] | null) => {
    if (id) {
      updateTask({
        variables: {
          _id: id,
          assigneeId: value,
        },
      });
    }
    onValueChange?.(value);
    setOpen(false);
  };

  return (
    <SelectAssigneeProvider
      onValueChange={handleValueChange}
      mode="single"
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Combobox.TriggerBase
          ref={ref}
          className={cn('w-min shadow-xs', className)}
          asChild
        >
          <Button variant="secondary" className="h-7">
            <SelectAssigneeFormValue />
          </Button>
        </Combobox.TriggerBase>
        <Combobox.Content>
          <SelectAssigneeContent teamIds={teamIds} />
        </Combobox.Content>
      </Popover>
    </SelectAssigneeProvider>
  );
});

SelectAssigneeDetail.displayName = 'SelectAssigneeDetail';

export const SelectAssignee = Object.assign(SelectAssigneeRoot, {
  Provider: SelectAssigneeProvider,
  Value: SelectAssigneeValue,
  Content: SelectAssigneeContent,
  FilterItem: SelectAssigneeFilterItem,
  FilterView: SelectAssigneeFilterView,
  FilterBar: SelectAssigneeFilterBar,
  InlineCell: SelectAssigneeInlineCell,
  FormItem: SelectAssigneeFormItem,
  Detail: SelectAssigneeDetail,
});
