import { useActivityItemContext } from '@/activity-logs/context/ActivityItemContext';
import { BlockEditorReadOnly } from 'erxes-ui/modules/blocks/components/BlockEditorReadOnly';
import { parseInternalNote } from '../utils/parseInternalNote';
export const InternalNoteLog = () => {
  const { content } = useActivityItemContext();

  const blocks = parseInternalNote(content);

  if (!blocks) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className="[&_*]:font-family-inherit"
      />
    );
  }

  return <BlockEditorReadOnly content={blocks} />;
};
