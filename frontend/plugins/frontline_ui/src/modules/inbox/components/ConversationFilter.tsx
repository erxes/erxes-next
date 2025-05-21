import { IconCheckbox, IconSortDescending } from '@tabler/icons-react';
import { Button, Checkbox, CommandBar, Separator } from 'erxes-ui';
import { FilterConversations } from './Filter';
import { selectConversationsState } from '../states/selectConversationsState';
import { useAtom } from 'jotai';
import { useConversationListContext } from '../hooks/useConversationListContext';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ReplaceAssignee } from './ReplaceAssignee';
import { AddTagToConversations } from './AddTagToConversations';

export const ConversationFilter = () => {
  return (
    <div className="flex items-center pl-2">
      <ConversationSelectAll />
      <Button variant="ghost" size="icon" className="ml-auto">
        <IconSortDescending />
      </Button>
      <FilterConversations />
      <ConversationsCommandBar />
    </div>
  );
};

export const ConversationSelectAll = () => {
  const { conversations } = useConversationListContext();
  const [selectedConversations, setSelectedConversations] = useAtom(
    selectConversationsState,
  );
  const [searchParams] = useSearchParams();

  // Reset selection when search params change
  useEffect(() => {
    setSelectedConversations([]);
  }, [searchParams, setSelectedConversations]);

  const isAllSelected = selectedConversations.length === conversations?.length;
  const isSomeSelected = selectedConversations.length > 0;

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      const conversationIds = conversations.map(
        (conversation) => conversation._id,
      );
      setSelectedConversations(conversationIds);
    } else {
      setSelectedConversations([]);
    }
  };

  return (
    <Checkbox
      checked={isAllSelected ? true : isSomeSelected ? 'indeterminate' : false}
      onCheckedChange={handleCheckboxChange}
    />
  );
};

export const ConversationsCommandBar = () => {
  const [selectedConversations, setSelectedConversations] = useAtom(
    selectConversationsState,
  );
  return (
    <CommandBar open={selectedConversations.length > 0}>
      <CommandBar.Bar>
        <CommandBar.Value onClose={() => setSelectedConversations([])}>
          {selectedConversations.length} selected
        </CommandBar.Value>
        <Separator.Inline />
        <ReplaceAssignee />
        <AddTagToConversations />
        <Button variant="secondary">
          <IconCheckbox />
          Resolve All
        </Button>
      </CommandBar.Bar>
    </CommandBar>
  );
};
