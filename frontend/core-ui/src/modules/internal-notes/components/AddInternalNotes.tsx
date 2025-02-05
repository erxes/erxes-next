import { useCreateBlockNote } from '@blocknote/react';
import { Block } from '@blocknote/core';

import { BLOCK_SCHEMA } from 'erxes-ui/modules/blocks/constant/blockEditorSchema';
import { BlockEditor } from 'erxes-ui/modules/blocks/components/BlockEditor';
import { AssignMemberInEditor } from '@/team-members/components/AssignMemberInEditor';
import { Button } from 'erxes-ui/components';
import { IconArrowUp } from '@tabler/icons-react';

export function AddInternalNotes() {
  const initialBlocks: Partial<Block>[] = [{ type: 'paragraph', content: [] }];
  const editor = useCreateBlockNote({
    schema: BLOCK_SCHEMA,
    initialContent: initialBlocks,
  });

  const handleChange = async () => {
    await editor.blocksToHTMLLossy(editor.document);
  };

  return (
    <div className="py-4 h-full overflow-hidden">
      <BlockEditor
        editor={editor}
        onChange={handleChange}
        className="h-full overflow-auto pb-8"
      >
        <AssignMemberInEditor editor={editor} />
      </BlockEditor>
      <div className="relative">
        <Button variant="secondary" className="absolute bottom-1 inset-x-4">
          <IconArrowUp className="w-4 h-4" />
          Post
        </Button>
      </div>
    </div>
  );
}
