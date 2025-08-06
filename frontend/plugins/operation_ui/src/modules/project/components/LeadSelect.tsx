import {
  Combobox,
  Command,
  RecordTableCellContent,
  RecordTablePopover,
  RecordTableCellTrigger,
} from 'erxes-ui';
import {
  useUsers,
  SelectMember,
  currentUserState,
  IUser,
  useSelectMemberContext,
} from 'ui-modules';
import { useAtomValue } from 'jotai';
import { useGetTeamMembers } from '@/team/hooks/useGetTeamMembers';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useUpdateProject } from '@/project/hooks/useUpdateProject';
export const LeadSelect = ({
  teamIds,
  value,
  id,
}: {
  teamIds?: string[] | string;
  value?: string;
  id: string;
}) => {
  const [open, setOpen] = useState(false);
  const { updateProject } = useUpdateProject();
  const onValueChange = (value: string | string[]) => {
    updateProject({
      variables: {
        _id: id,
        leadId: value,
      },
    });
    setOpen(false);
  };
  return (
    <SelectMember.Provider
      value={value}
      mode={'single'}
      onValueChange={onValueChange}
    >
      <RecordTablePopover open={open} onOpenChange={setOpen}>
        <RecordTableCellTrigger>
          <SelectMember.Value placeholder="Lead not specified" />
        </RecordTableCellTrigger>
        <RecordTableCellContent>
          <SelectTeamMemberContent teamIds={teamIds} exclude={false} />
        </RecordTableCellContent>
      </RecordTablePopover>
    </SelectMember.Provider>
  );
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
