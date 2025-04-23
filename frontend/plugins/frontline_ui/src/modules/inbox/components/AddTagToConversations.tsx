import { useAtom } from 'jotai';
import { SelectSingleTag, useGiveTags } from 'ui-modules';
import { selectConversationsState } from '../states/selectConversationsState';

export const AddTagToConversations = () => {
  const { giveTags } = useGiveTags();
  const [selectedConversations, setSelectedConversations] = useAtom(
    selectConversationsState,
  );

  const handleAddTag = (value: string) => {
    giveTags({
      variables: {
        type: 'frontline:conversation',
        tagIds: [value],
        targetIds: selectedConversations,
      },
      update: (cache, { data }) => {
        selectedConversations.forEach((conversationId) => {
          try {
            cache.modify({
              id: cache.identify({
                __typename: 'Conversation',
                _id: conversationId,
              }),
              fields: {
                tagIds: (existingData) => {
                  if (existingData.includes(value)) {
                    return existingData;
                  }
                  return [...existingData, value];
                },
              },
            });
          } catch (error) {
            console.error(error);
          }
        });
      },
      onCompleted: () => {
        setSelectedConversations([]);
      },
    });
  };

  return (
    <SelectSingleTag
      tagType="frontline:conversation"
      onValueChange={(value) => {
        handleAddTag(value);
      }}
      className="h-7 shadow-none rounded"
      variant="secondary"
    />
  );
};
