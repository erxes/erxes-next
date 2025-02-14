import { ContactDetailActions } from '@/contacts/detail/components/ContactDetailActions';

import {
  ContactDetailTabContent,
  ContactDetailLayout,
} from './ContactDetailLayout';
import { ContactGeneral } from './ContactGeneral';
import { ContactDetailGeneral } from './ContactDetailGeneral';
import { Separator } from 'erxes-ui/components';
import { ContactProperties } from './ContactProperties';

export const ContactDetail = () => {
  return (
    <ContactDetailLayout actions={<ContactDetailActions />}>
      <ContactDetailGeneral />
      <Separator />
      <ContactDetailTabContent value="overview">
        <ContactGeneral />
      </ContactDetailTabContent>
      <ContactDetailTabContent value="properties">
        <ContactProperties />
      </ContactDetailTabContent>
    </ContactDetailLayout>
  );
};
