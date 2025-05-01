import { CustomersHeader } from '@/contacts/customers-new/components/CustomersHeader';
import { CustomersRecordTable } from '@/contacts/customers-new/components/CustomersRecordTable';
import { CustomersFilter } from '@/contacts/customers-new/components/CustomersFilter';
import { CustomerDetail } from '@/contacts/customers-new/customer-detail/components/CustomerDetail';
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
