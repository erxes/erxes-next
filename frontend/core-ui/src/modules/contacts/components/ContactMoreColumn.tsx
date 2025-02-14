import { Cell } from '@tanstack/react-table';
import { useQueryState } from 'nuqs';
import { useSetRecoilState } from 'recoil';

import { RecordTableMoreButton } from 'erxes-ui/modules/record-table/components/MoreColumn';

import { renderingContactDetailAtom } from '@/contacts/detail/states/contactDetailStates';
import { Customer } from '@/contacts/types/contactsTypes';
export const ContactMoreColumnCell = ({
  cell,
}: {
  cell: Cell<Customer, unknown>;
}) => {
  const [, setOpen] = useQueryState('contact_id');
  const setRenderingContactDetail = useSetRecoilState(
    renderingContactDetailAtom,
  );
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
