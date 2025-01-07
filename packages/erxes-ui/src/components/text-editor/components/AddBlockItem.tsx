import { useComponentsContext } from '@blocknote/react';
import { BlockNoteEditor } from '@blocknote/core';

type AddBlockItemProps = {
  editor: BlockNoteEditor;
  children: React.ReactNode;
};

type ContentItem = {
  type: string;
  text: string;
  styles: any;
};

export const AddBlockItem = ({ editor, children }: AddBlockItemProps) => {
  const Components = useComponentsContext();

  if (!Components) {
    return null;
  }

  const handleAddBlock = () => {
    const blockIdentifier = editor.getTextCursorPosition().block;
    const currentBlockContent = blockIdentifier?.content as Array<ContentItem> | undefined;

    if (!currentBlockContent || currentBlockContent.length === 0) {
      editor.openSuggestionMenu('/');
    } else {
      editor.insertBlocks([{ type: 'paragraph', content: [] }], blockIdentifier.id, 'after');
      editor.openSuggestionMenu('/');
    }
  };

  return (
    <Components.Generic.Menu.Item onClick={handleAddBlock}>
        {children}
    </Components.Generic.Menu.Item>
  );
};
