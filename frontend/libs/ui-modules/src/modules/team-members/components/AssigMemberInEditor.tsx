import {
  DefaultReactSuggestionItem,
  SuggestionMenuController,
} from '@blocknote/react';
import { SuggestionMenu, SuggestionMenuItem, IBlockEditor } from 'erxes-ui';
import { IMember, MentionMenuProps } from '../types/TeamMembers';
import { useUsers } from '../hooks/useUsers';
import { useState } from 'react';
import { IconLoader } from '@tabler/icons-react';

import { useInView } from 'react-intersection-observer';
import { MembersInline } from './MembersInline';

export const AssignMemberInEditor = ({ editor }: { editor: IBlockEditor }) => {
  const [searchValue, setSearchValue] = useState('');
  const { users, loading, handleFetchMore, totalCount } = useUsers({
    variables: { searchValue },
  });
  return (
    <SuggestionMenuController
      triggerCharacter="@"
      suggestionMenuComponent={(props) => (
        <MentionMenu
          {...props}
          loading={loading}
          users={users}
          handleFetchMore={handleFetchMore}
          totalCount={totalCount}
        />
      )}
      getItems={async (query) => {
        setSearchValue(query);
        return getMentionMenuItems(editor, users);
      }}
    />
  );
};

export function MentionMenu({
  items,
  selectedIndex,
  users,
  loading,
  handleFetchMore,
  totalCount,
}: MentionMenuProps) {
  const { ref: bottomRef } = useInView({
    onChange: (inView) => inView && handleFetchMore(),
  });
  return (
    <SuggestionMenu>
      {loading ? (
        <div className="p-2">Loading...</div>
      ) : items.length > 0 ? (
        <>
          {items.map((item, index) => (
            <MentionMenuItem
              key={item.title}
              onClick={item.onItemClick}
              text={item.title}
              isSelected={selectedIndex === index}
              index={index}
              user={users.find((user) => user.details.fullName === item.title)}
            />
          ))}
          {!!users.length && users.length < totalCount && (
            <div ref={bottomRef} className="flex items-center gap-2">
              <IconLoader className="w-4 h-4 animate-spin text-muted-foreground mr-1" />
              Load more...
            </div>
          )}
        </>
      ) : (
        <div className="p-2">No results found.</div>
      )}
    </SuggestionMenu>
  );
}

interface MentionMenuItemProps {
  onClick: () => void;
  isSelected: boolean;
  index: number;
  text: string;
  user?: IMember;
}

function MentionMenuItem({ onClick, isSelected, user }: MentionMenuItemProps) {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!onClick) return;
    event.preventDefault();
    event.stopPropagation();
    onClick();
  };

  return (
    <SuggestionMenuItem
      onClick={handleClick}
      className="justify-start"
      isSelected={isSelected}
    >
      {!!user && <MembersInline members={[user]} />}
    </SuggestionMenuItem>
  );
}

function getMentionMenuItems(
  editor: IBlockEditor,
  users: IMember[],
): DefaultReactSuggestionItem[] {
  return users.map((user) => ({
    title: user.details.fullName,
    onItemClick: () => {
      editor.insertInlineContent([
        {
          type: 'mention',
          props: { fullName: user.details.fullName, _id: user._id },
        },
        ' ',
      ]);
    },
  }));
}
