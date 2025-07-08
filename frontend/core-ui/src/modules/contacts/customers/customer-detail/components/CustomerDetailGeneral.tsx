import { FullNameField } from 'erxes-ui';
import { useCustomerDetail } from '@/contacts/customers/customer-detail/hooks/useCustomerDetail';
import { IconDeviceMobileMessage } from '@tabler/icons-react';
import { IconMail } from '@tabler/icons-react';
import { IconPhone } from '@tabler/icons-react';
import { Avatar, Button, readImage } from 'erxes-ui';
import { TextFieldCustomer } from '../../customer-edit/components/TextField';
import { useCustomerEdit } from '@/contacts/customers/hooks/useEditCustomer';
import { ContactsHotKeyScope } from '@/contacts/types/ContactsHotKeyScope';
export const CustomerDetailGeneral = () => {
  const { customerDetail } = useCustomerDetail();
  const {
    _id,
    firstName,
    lastName,
    middleName,
    primaryEmail,
    primaryPhone,
    avatar,
    position,
    department,
  } = customerDetail || {};
  const { customerEdit } = useCustomerEdit();
  return (
    <div className="py-5 px-8">
      <div className="flex gap-3 items-center flex-col lg:flex-row">
        <Avatar size="lg" className="h-12 w-12">
          <Avatar.Image src={readImage(avatar)} />
          <Avatar.Fallback>
            {(firstName || lastName || primaryEmail || primaryPhone)?.charAt(0)}
          </Avatar.Fallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <FullNameField
            scope={ContactsHotKeyScope.CustomerDetailPage + '.' + _id + '.Name'}
            closeOnEnter
            firstName={firstName}
            lastName={
              middleName
                ? `${middleName || ''} ${lastName || ''}`
                : lastName || ''
            }
            onClose={(_firstName, _lastName) => {
              if (_firstName !== firstName || _lastName !== lastName) {
                customerEdit({
                  variables: {
                    _id,
                    firstName: _firstName,
                    lastName: _lastName,
                  },
                });
              }
            }}
          />

          <div className="text-muted-foreground font-medium text-sm leading-none flex gap-1 items-center">
            <TextFieldCustomer
              value={position}
              placeholder="Add Position"
              className="text-sm"
              field="position"
              _id={_id}
            />
            @
            <TextFieldCustomer
              value={department}
              placeholder="Add Department"
              className="text-sm"
              field="department"
              _id={_id}
            />
          </div>
        </div>
        <div className="inline-flex rounded-lg bg-muted -space-x-px lg:ml-auto">
          <Button
            variant="outline"
            className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 border"
          >
            <IconPhone /> Call
          </Button>
          <Button
            variant="outline"
            className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 border"
          >
            <IconMail /> Write Email
          </Button>
          <Button
            variant="outline"
            className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 border"
          >
            <IconDeviceMobileMessage /> Message
          </Button>
        </div>
      </div>
    </div>
  );
};
