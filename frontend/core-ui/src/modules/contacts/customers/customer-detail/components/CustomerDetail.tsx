import { Separator } from 'erxes-ui';
import { CustomerDetailActions } from './CustomerDetailActions';
import {
  CustomerDetailLayout,
  CustomerDetailTabContent,
} from '@/contacts/customers/components/CustomerDetailLayout';
import { CustomerDetailGeneral } from './CustomerDetailGeneral';
import { CustomerGeneral } from './CustomerGeneral';
import { CustomerProperties } from './CustomerProperties';

export const CustomerDetail = () => {
  return (
    <CustomerDetailLayout actions={<CustomerDetailActions />}>
      <CustomerDetailGeneral />
      <Separator />
      <CustomerDetailTabContent value="overview">
        <CustomerGeneral />
      </CustomerDetailTabContent>
      <CustomerDetailTabContent value="properties">
        <CustomerProperties />
      </CustomerDetailTabContent>
    </CustomerDetailLayout>
  );
};
