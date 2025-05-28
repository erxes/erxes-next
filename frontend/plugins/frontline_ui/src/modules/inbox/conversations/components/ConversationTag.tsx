import { SelectTags } from 'ui-modules';

export const ConversationTag = ({
  conversationIds,
}: {
  conversationIds: string[];
}) => {
  return (
    <SelectTags.Detail
      tagType="frontline:conversation"
      targetIds={conversationIds}
    />
  );
};
