import ContactsHeader from '@/contacts/components/ContactsHeader';
import { ContactsRecordTable } from '@/contacts/components/ContactsRecordTable';

export const ContactsIndexPage = () => {
  return (
    <div className="flex flex-col h-full p-3 pt-0">
      <ContactsHeader />
      <ContactsRecordTable />
    </div>
  );
};
