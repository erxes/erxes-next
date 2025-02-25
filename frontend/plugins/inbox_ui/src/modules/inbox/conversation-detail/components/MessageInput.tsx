import { useCreateBlockNote } from '@blocknote/react';
import { IconArrowUp, IconPaperclip } from '@tabler/icons-react';
import { BlockEditor, Button, Toggle, cn } from 'erxes-ui';
import { BLOCK_SCHEMA } from 'erxes-ui/modules/blocks/constant/blockEditorSchema';
import { useState } from 'react';
import { AssignMemberInEditor } from 'ui-modules';
export const MessageInput = () => {
  const [isInternalNote, setIsInternalNote] = useState(false);
  const editor = useCreateBlockNote({
    schema: BLOCK_SCHEMA,
  });
  return (
    <div
      className={cn(
        'flex flex-col h-full py-4 gap-1',
        isInternalNote && 'bg-yellow-50 dark:bg-yellow-950',
      )}
    >
      <BlockEditor
        editor={editor}
        onChange={() => console.log('onChange')}
        onBlur={() => console.log('onBlur')}
        onFocus={() => console.log('onFocus')}
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

        <Button size="lg" className="ml-auto">
          <IconArrowUp />
          Send
        </Button>
      </div>
    </div>
  );
};
