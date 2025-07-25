import { FullNameField, Label } from 'erxes-ui';
import { useCustomerDetail } from '@/contacts/customers/customer-detail/hooks/useCustomerDetail';
import { IconDeviceMobileMessage, IconMessage } from '@tabler/icons-react';
import { IconMail } from '@tabler/icons-react';
import { IconPhone } from '@tabler/icons-react';
import { Avatar, Button, readImage } from 'erxes-ui';
import { TextFieldCustomer } from '../../customer-edit/components/TextField';
import { useCustomerEdit } from '@/contacts/customers/hooks/useEditCustomer';
import { ContactsHotKeyScope } from '@/contacts/types/ContactsHotKeyScope';
import { SelectCompany } from 'ui-modules';
export const CustomerDetailGeneral = () => {
  const { customerDetail, loading } = useCustomerDetail();
  const {
    _id,
    firstName,
    lastName,
    middleName,
    primaryEmail,
    primaryPhone,
    avatar,
  } = customerDetail || {};
  const { customerEdit } = useCustomerEdit();
  return (
    <div className="py-5 px-8 flex flex-col gap-6">
      <div className="flex gap-3 items-center flex-col lg:flex-row ">
        <Avatar size="lg" className="h-12 w-12">
          <Avatar.Image src={readImage(avatar || '')} />
          <Avatar.Fallback>
            {(firstName || lastName || primaryEmail || primaryPhone)?.charAt(0)}
          </Avatar.Fallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <FullNameField
            scope={ContactsHotKeyScope.CustomerDetailPage + '.' + _id + '.Name'}
            closeOnEnter
            firstName={firstName || ''}
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
        </div>
        <div className="inline-flex rounded-lg bg-muted -space-x-px lg:ml-auto "> 
          <Button
            variant="outline"
            className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 border font-semibold text-sm"
          >
            <IconMail />
            Email
          </Button>
          <Button
            variant="outline"
            className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 border font-semibold text-sm"
          >
            <IconMessage /> Message
          </Button>
          <Button
            variant="outline"
            className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 border font-semibold text-sm"
          >
            <IconDeviceMobileMessage /> SMS
          </Button>
          <Button
            variant="outline"
            className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 border font-semibold text-sm"
          >
            <IconPhone /> Call
          </Button>
        </div>
      </div>
      <fieldset className="space-y-2">
        <Label asChild>
          <legend>Works At</legend>
        </Label>
        <SelectCompany.Detail
          value={customerDetail?.companies?.map((c) => c._id) || []}
          onValueChange={(value) => {
            customerEdit({
              variables: {
                _id,
                companies: value,
              },
            });
          }}
          mode="multiple"
        />
      </fieldset>
    </div>
  );
};
