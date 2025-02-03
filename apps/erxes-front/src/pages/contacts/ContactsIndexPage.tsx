import { useQueryState } from 'nuqs';
import { useRecoilValue } from 'recoil';

import { ContactsHeader } from '@/contacts/components/ContactsHeader';
import { ContactsRecordTable } from '@/contacts/components/ContactsRecordTable';
import { renderingContactDetailAtom } from '@/contacts/detail/states/contactDetailStates';
import { ContactDetail } from '@/contacts/detail/components/ContactDetail';

export const ContactsIndexPage = () => {
  const renderingContactDetail = useRecoilValue(renderingContactDetailAtom);
  const [contactId] = useQueryState('contact_id');

  return (
    <div className="flex flex-col h-full p-3 pt-0">
      <ContactsHeader />
      {!(renderingContactDetail && contactId) && <ContactsRecordTable />}
      <ContactDetail />
    </div>
  );
};
