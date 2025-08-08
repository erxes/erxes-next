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
  RecordTableCellContent,
  RecordTableCellTrigger,
  RecordTablePopover,
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
import { useUpdateProject } from '@/project/hooks/useUpdateProject';
import { IconUser } from '@tabler/icons-react';

export const SelectLeadProvider = SelectMember.Provider;

const SelectLeadValue = ({ placeholder }: { placeholder?: string }) => {
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
  const { users, loading, handleFetchMore, totalCount, error } = useUsers({
    variables: {
      searchValue: debouncedSearch,
      excludeIds: exclude,
      ids: [currentUser?._id, ...(excludeIds || [])],
    },
  });
  const membersList = exclude
    ? [currentUser, ...users].filter(
        (user) =>
          !memberIds?.find((memberId) => memberId === user._id) &&
          !excludeIds?.find((excludeId) => excludeId === user._id),
      )
    : users.filter(
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
            <Command.Separator className="my-1" />
          </>
        )}

        {!loading &&
          membersList.map((user) => (
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

const SelectLeadContent = ({ teamIds }: { teamIds?: string[] | string }) => {
  return <SelectTeamMemberContent teamIds={teamIds} exclude={false} />;
};

export const SelectLeadFilterItem = () => {
  return (
    <Filter.Item value="lead">
      <IconUser />
      Lead
    </Filter.Item>
  );
};

export const SelectLeadFilterView = ({
  onValueChange,
  queryKey,
}: {
  onValueChange?: (value: string) => void;
  queryKey?: string;
}) => {
  const [lead, setLead] = useQueryState<string>(queryKey || 'lead');
  const { resetFilterState } = useFilterContext();
  const { teams } = useGetCurrentUsersTeams();

  return (
    <Filter.View filterKey={queryKey || 'lead'}>
      <SelectLeadProvider
        mode="single"
        value={lead || ''}
        onValueChange={(value) => {
          setLead(value as string);
          resetFilterState();
          onValueChange?.(value as string);
        }}
      >
        <SelectLeadContent teamIds={teams?.map((team) => team._id)} />
      </SelectLeadProvider>
    </Filter.View>
  );
};

export const SelectLeadFilterBar = ({
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
  const [lead, setLead] = useQueryState<string>(queryKey || 'lead');
  const [open, setOpen] = useState(false);

  if (!lead) {
    return null;
  }

  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconUser />
        {!iconOnly && 'Lead'}
      </Filter.BarName>
      <SelectLeadProvider
        mode="single"
        value={lead || ''}
        onValueChange={(value) => {
          if (value) {
            setLead(value as string);
          } else {
            setLead(null);
          }
          setOpen(false);
          onValueChange?.(value as string);
        }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Filter.BarButton filterKey={queryKey || 'lead'}>
              <SelectLeadValue />
            </Filter.BarButton>
          </Popover.Trigger>
          <Combobox.Content>
            <SelectLeadContent teamIds={teamIds} />
          </Combobox.Content>
        </Popover>
      </SelectLeadProvider>
      <Filter.BarClose filterKey={queryKey || 'lead'} />
    </Filter.BarItem>
  );
};

export const SelectLeadInlineCell = ({
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
  onValueChange?: (value: string | string[]) => void;
  scope?: string;
} & Omit<
  React.ComponentProps<typeof SelectLeadProvider>,
  'children' | 'onValueChange' | 'value'
>) => {
  const { updateProject } = useUpdateProject();
  const [open, setOpen] = useState(false);

  const handleValueChange = (value: string | string[]) => {
    if (id) {
      updateProject({
        variables: {
          _id: id,
          leadId: value,
        },
      });
    }
    onValueChange?.(value);
    setOpen(false);
  };

  return (
    <SelectLeadProvider
      mode="single"
      value={value || ''}
      onValueChange={handleValueChange}
      {...props}
    >
      <RecordTablePopover open={open} onOpenChange={setOpen} scope={scope}>
        <RecordTableCellTrigger>
          <SelectLeadValue placeholder={id ? 'Lead not specified' : ''} />
        </RecordTableCellTrigger>
        <RecordTableCellContent>
          <SelectLeadContent teamIds={teamIds} />
        </RecordTableCellContent>
      </RecordTablePopover>
    </SelectLeadProvider>
  );
};

const SelectLeadFormValue = () => {
  const { members, memberIds, setMembers } = useSelectMemberContext();
  if (members.length === 0)
    return (
      <span className="flex items-center gap-2">
        <IconUser className="size-4" />
        <p className="text-muted-foreground font-medium text-base">Lead</p>
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

export const SelectLeadFormItem = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<React.ComponentProps<typeof SelectLeadProvider>, 'children'> & {
    className?: string;
  }
>(({ onValueChange, className, ...props }, ref) => {
  const { teams } = useGetCurrentUsersTeams();
  const teamIds = teams?.map((team) => team._id);
  const [open, setOpen] = useState(false);
  return (
    <SelectLeadProvider
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
            <Button variant="secondary">
              <SelectLeadFormValue />
            </Button>
          </Combobox.TriggerBase>
        </Form.Control>
        <Combobox.Content>
          <SelectLeadContent teamIds={teamIds} />
        </Combobox.Content>
      </Popover>
    </SelectLeadProvider>
  );
});

SelectLeadFormItem.displayName = 'SelectLeadFormItem';

const SelectLeadRoot = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<React.ComponentProps<typeof SelectLeadProvider>, 'children'> &
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
      <SelectLeadProvider
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
            <SelectLeadValue placeholder={placeholder} />
          </Combobox.Trigger>
          <Combobox.Content>
            <SelectLeadContent teamIds={teamIds} />
          </Combobox.Content>
        </Popover>
      </SelectLeadProvider>
    );
  },
);

SelectLeadRoot.displayName = 'SelectLeadRoot';

export const SelectLead = Object.assign(SelectLeadRoot, {
  Provider: SelectLeadProvider,
  Value: SelectLeadValue,
  Content: SelectLeadContent,
  FilterItem: SelectLeadFilterItem,
  FilterView: SelectLeadFilterView,
  FilterBar: SelectLeadFilterBar,
  InlineCell: SelectLeadInlineCell,
  FormItem: SelectLeadFormItem,
});
