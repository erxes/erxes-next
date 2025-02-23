import { useCreateBlockNote } from '@blocknote/react';
import { IconArrowUp } from '@tabler/icons-react';
import { BlockEditor, Button } from 'erxes-ui/components';
import { BLOCK_SCHEMA } from 'erxes-ui/modules/blocks/constant/blockEditorSchema';

export const MessageInput = () => {
  const editor = useCreateBlockNote({
    schema: BLOCK_SCHEMA,
  });
  return (
    <div className="flex flex-col h-full">
      <BlockEditor
        editor={editor}
        onChange={() => console.log('onChange')}
        onBlur={() => console.log('onBlur')}
        onFocus={() => console.log('onFocus')}
        className=" h-full w-full overflow-y-auto"
      />
      <Button className="ml-auto mr-6" size="lg">
        <IconArrowUp />
        Send
      </Button>
    </div>
  );
};
