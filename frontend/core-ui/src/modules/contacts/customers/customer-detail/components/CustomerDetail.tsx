import { Separator } from 'erxes-ui';
import { CustomerDetailActions } from './CustomerDetailActions';
import {
  ContactDetailLayout,
  ContactDetailTabContent,
} from '~/modules/contacts/components/ContactDetailLayout';
import { CustomerDetailGeneral } from './CustomerDetailGeneral';
import { CustomerGeneral } from './CustomerGeneral';
import { CustomerProperties } from './CustomerProperties';

export const CustomerDetail = () => {
  return (
    <ContactDetailLayout actions={<CustomerDetailActions />}>
      <CustomerDetailGeneral />
      <Separator />
      <ContactDetailTabContent value="overview">
        <CustomerGeneral />
      </ContactDetailTabContent>
      <ContactDetailTabContent value="properties">
        <CustomerProperties />
      </ContactDetailTabContent>
    </ContactDetailLayout>
  );
};
