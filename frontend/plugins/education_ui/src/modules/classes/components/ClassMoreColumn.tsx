import { Cell } from '@tanstack/react-table';
import { RecordTable, usePreviousHotkeyScope } from 'erxes-ui';
import { useSetAtom } from 'jotai';
import { useQueryState } from 'erxes-ui';
import { renderingClassDetailAtom } from '@/classes/states/classDetailStates';
import { ClassHotKeyScope } from '@/classes/types/ClassHotKeyScope';

export const ClassMoreColumnCell = ({ cell }: { cell: Cell<any, unknown> }) => {
  const [, setOpen] = useQueryState('classId');
  const setRenderingContactDetail = useSetAtom(renderingClassDetailAtom);
  const { setHotkeyScopeAndMemorizePreviousScope } = usePreviousHotkeyScope();
  const { _id } = cell.row.original;
  return (
    <RecordTable.MoreButton
      className="w-full h-full"
      onClick={() => {
        setOpen(_id);
        setTimeout(() => {
          setHotkeyScopeAndMemorizePreviousScope(
            ClassHotKeyScope.ClassEditSheet,
          );
        }, 100);
        setRenderingContactDetail(false);
      }}
    />
  );
};

export const classMoreColumn = {
  id: 'more',
  cell: ClassMoreColumnCell,
  size: 33,
};
