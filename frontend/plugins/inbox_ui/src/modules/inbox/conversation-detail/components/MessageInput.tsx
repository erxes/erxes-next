import { IconArrowUp, IconPaperclip } from '@tabler/icons-react';
import {
  BlockEditor,
  Button,
  Spinner,
  Toggle,
  cn,
  getMentionedUserIds,
  useBlockEditor,
} from 'erxes-ui';
import { useState } from 'react';
import { AssignMemberInEditor } from 'ui-modules';
import { useConversationMessageAdd } from '../hooks/useConversationMessageAdd';
import { useQueryState } from '../../hooks/useQueryState';

export const MessageInput = () => {
  const [conversationId] = useQueryState('conversationId');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [content, setContent] = useState<string>('');
  const [mentionedUserIds, setMentionedUserIds] = useState<string[]>([]);
  const editor = useBlockEditor();
  const { addConversationMessage, loading } = useConversationMessageAdd();

  const handleChange = async () => {
    const content = await editor?.document;
    content.pop();
    setContent(JSON.stringify(content));
    const mentionedUserIds = getMentionedUserIds(content);
    setMentionedUserIds(mentionedUserIds);
  };

  const handleSubmit = () => {
    addConversationMessage({
      variables: {
        conversationId,
        content,
        mentionedUserIds,
        internal: isInternalNote,
      },
    });
  };

  return (
    <div
      className={cn(
        'flex flex-col h-full py-4 gap-1',
        isInternalNote && 'bg-yellow-50 dark:bg-yellow-950',
      )}
    >
      <BlockEditor
        editor={editor}
        onChange={handleChange}
        className={cn(
          'h-full w-full overflow-y-auto',
          isInternalNote && 'internal-note',
        )}
      >
        {isInternalNote && <AssignMemberInEditor editor={editor} />}
      </BlockEditor>
      <div className="flex px-6 gap-4">
        <Toggle
          pressed={isInternalNote}
          size="lg"
          variant="outline"
          onPressedChange={() => setIsInternalNote(!isInternalNote)}
        >
          Internal Note
        </Toggle>
        <Button size="icon" variant="outline" className="size-8">
          <IconPaperclip />
        </Button>

        <Button
          size="lg"
          className="ml-auto"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? <Spinner size="small" /> : <IconArrowUp />}
          Send
        </Button>
      </div>
    </div>
  );
};
