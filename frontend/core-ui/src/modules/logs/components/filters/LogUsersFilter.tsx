import { AssignMemberItem, AssignMemberList, IUser } from 'ui-modules';
import { Command, useQueryState } from 'erxes-ui';

export const LogUsersFilter = () => {
  const [selectedUserIds, setUserIds] = useQueryState<string[]>('userIds');

  const handleUserSelect = (user?: IUser) => {
    if (!user) {
      return;
    }

    if (selectedUserIds?.includes(user?._id)) {
      return setUserIds(
        selectedUserIds.filter((userId) => userId !== user?._id),
      );
    }

    return setUserIds([...(selectedUserIds || []), user?._id]);
  };

  return (
    <Command shouldFilter={false} onSelect={(e) => e.currentTarget}>
      <Command.List className="p-1 ">
        <AssignMemberList
          renderItem={(user) => (
            <AssignMemberItem
              key={user._id}
              user={user}
              isSelected={(selectedUserIds || [])?.includes(user._id)}
              handleSelect={handleUserSelect}
            />
          )}
        />
      </Command.List>
    </Command>
  );
};
