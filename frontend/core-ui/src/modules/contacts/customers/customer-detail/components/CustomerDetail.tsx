import { Separator, Sheet } from 'erxes-ui';
import { CustomerDetailActions } from './CustomerDetailActions';
import {
  CustomerDetailLayout,
  CustomerDetailTabContent,
} from '@/contacts/customers/customer-detail/components/CustomerDetailLayout';
import { CustomerDetailGeneral } from './CustomerDetailGeneral';
import { CustomerGeneral } from './CustomerGeneral';
import { CustomerProperties } from './CustomerProperties';

export const CustomerDetail = () => {
  return (
    <CustomerDetailLayout actions={<CustomerDetailActions />}>
      <div className="flex flex-auto">
        <Sheet.Content className="border-b-0 rounded-b-none">
          <CustomerDetailGeneral />
          <Separator />
          <CustomerDetailTabContent value="overview">
            <CustomerGeneral />
          </CustomerDetailTabContent>
          <CustomerDetailTabContent value="properties">
            <CustomerProperties />
          </CustomerDetailTabContent>
        </Sheet.Content>
      </div>
    </CustomerDetailLayout>
  );
};
