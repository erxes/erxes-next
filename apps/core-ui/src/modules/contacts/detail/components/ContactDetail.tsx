import { ContactDetailActions } from './components/ContactDetailActions';

import {
  ContactDetailTabContent,
  ContactDetailLayout,
} from './ContactDetailLayout';
import { ContactGeneral } from './ContactGeneral';

export const ContactDetail = () => {
  return (
    <ContactDetailLayout actions={<ContactDetailActions />}>
      <ContactDetailTabContent value="general">
        <ContactGeneral />
      </ContactDetailTabContent>
    </ContactDetailLayout>
  );
};
