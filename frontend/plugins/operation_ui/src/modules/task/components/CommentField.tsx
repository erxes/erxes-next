import { BlockEditor, useBlockEditor } from 'erxes-ui';
import { AssignMemberInEditor } from 'ui-modules';

export const CommentField = () => {
  const editor = useBlockEditor();
  return (
    <BlockEditor editor={editor}>
      <AssignMemberInEditor editor={editor} />
    </BlockEditor>
  );
};
