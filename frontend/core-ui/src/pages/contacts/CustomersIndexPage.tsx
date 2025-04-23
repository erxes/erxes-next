import { CustomersHeader } from '@/contacts/customers-new/components/CustomersHeader';
import { CustomersRecordTable } from '@/contacts/customers-new/components/CustomersRecordTable';

export const ContactsIndexPage = () => {
  return (
    <div className="flex flex-col h-full p-3 pt-0">
      <CustomersHeader />
      <CustomersRecordTable />
    </div>
  );
};
