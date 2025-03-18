import { Cell } from '@tanstack/react-table';
import { RecordTableMoreButton } from 'erxes-ui/modules/record-table/components/MoreColumn';
import { renderingContactDetailAtom } from '@/contacts/detail/states/contactDetailStates';
import { useSetAtom } from 'jotai';
import { ICustomer } from '../types/customerType';
import { useQueryState } from 'erxes-ui';
export const ContactMoreColumnCell = ({
  cell,
}: {
  cell: Cell<ICustomer, unknown>;
}) => {
  const [, setOpen] = useQueryState('contact_id');
  const setRenderingContactDetail = useSetAtom(renderingContactDetailAtom);
  const { _id } = cell.row.original;
  return (
    <RecordTableMoreButton
      className="w-full h-full"
      onClick={() => {
        setOpen(_id);
        setRenderingContactDetail(false);
      }}
    />
  );
};

export const contactMoreColumn = {
  id: 'more',
  cell: ContactMoreColumnCell,
  size: 33,
};
