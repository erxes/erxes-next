import { useQueryState } from 'erxes-ui';
import { ContactsHeader } from '@/contacts/components/ContactsHeader';
import { ContactsRecordTable } from '@/contacts/components/ContactsRecordTable';
import { renderingContactDetailAtom } from '@/contacts/detail/states/contactDetailStates';
import { ContactDetail } from '@/contacts/detail/components/ContactDetail';
import { useAtom } from 'jotai';

export const ContactsIndexPage = () => {
  const [renderingContactDetail] = useAtom(renderingContactDetailAtom);
  const [contactId] = useQueryState('contact_id');

  return (
    <div className="flex flex-col h-full p-3 pt-0">
      <ContactsHeader />
      {!(renderingContactDetail && contactId) && <ContactsRecordTable />}
      <ContactDetail />
    </div>
  );
};
