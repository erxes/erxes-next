import { CustomersHeader } from '@/contacts/customers/components/CustomersHeader';
import { CustomersRecordTable } from '@/contacts/customers/components/CustomersRecordTable';
import { CustomersFilter } from '@/contacts/customers/components/CustomersFilter';
import { CustomerDetail } from '@/contacts/customers/customer-detail/components/CustomerDetail';
export const CustomersIndexPage = () => {
  return (
    <div className="flex flex-col h-full pt-0">
      <CustomersHeader />
      <CustomersFilter />
      <CustomersRecordTable />
      <CustomerDetail />
    </div>
  );
};
