import { IconReplaceUser } from '@tabler/icons-react';
import { useQueryState } from '../hooks/useQueryState';
import { Button } from 'erxes-ui';

export const ReplaceAssignee = () => {
  const [selectedConversations, setSelectedConversations] = useQueryState<
    string[]
  >('selectedConversations');

  return (
    <Button variant="secondary">
      <IconReplaceUser />
      Replace Assignee
    </Button>
  );
};
