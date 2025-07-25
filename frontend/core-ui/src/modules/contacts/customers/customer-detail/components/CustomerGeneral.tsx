import { Label, PhoneInput, Skeleton, Switch, Textarea } from 'erxes-ui';
import { useCustomerDetail } from '@/contacts/customers/customer-detail/hooks/useCustomerDetail';
import { CustomerDetailSelectTag } from '@/contacts/customers/customer-detail/components/CustomerDetailSelectTag';
import { TextFieldCustomer } from '@/contacts/customers/customer-edit/components/TextField';
import { CustomerDetailAssignedTo } from '@/contacts/customers/customer-detail/components/CustomerDetailAssignedTo';
import { useDebounce } from 'use-debounce';
import { useCustomerEdit } from '@/contacts/customers/hooks/useEditCustomer';
import { useEffect, useState } from 'react';
export const CustomerGeneral = () => {
  const { customerDetail, loading } = useCustomerDetail();
  const { customerEdit } = useCustomerEdit();
  if (!customerDetail) {
    return <div className="w-full h-full bg-red-400" />;
  }

  const { primaryEmail, primaryPhone, tagIds, ownerId, code, _id, score } =
    customerDetail;

  return (
    <>
      <div className="py-8 space-y-6">
        <CustomerDetailSelectTag tagIds={tagIds || []} customerId={_id} />
        <CustomerDetailAssignedTo ownerId={ownerId} customerId={_id} />
        <div className="px-8 font-medium flex gap-5 flex-col">
          <div className="grid grid-cols-2 gap-5 col-span-5">
            <DataListItem label="Code">
              <TextFieldCustomer
                value={code || ''}
                placeholder="Add Code"
                field="code"
                _id={_id}
              />
            </DataListItem>
            <DataListItem label="Primary Email">
              <TextFieldCustomer
                value={primaryEmail || ''}
                placeholder="Add Primary Email"
                field="primaryEmail"
                _id={_id}
              />
            </DataListItem>
            <DataListItem label="Primary Phone">
              <div className="rounded-sm shadow shadow-sm">
                <PhoneInput
                  value={primaryPhone || ''}
                  onChange={(value) => console.log(value)}
                  className="bg-transparent "
                />
              </div>
            </DataListItem>
            <DataListItem label="Score">
              <TextFieldCustomer
                value={score?.toString() || ''}
                placeholder="Add Score"
                field="score"
                _id={_id}
              />
            </DataListItem>
          </div>
          <DataListItem label="Subscribed">
            <Switch />
          </DataListItem>
          <DataListItem label="Description">
            <Textarea />
          </DataListItem>
        </div>
      </div>
    </>
  );
};

const DataListItem = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <fieldset className="space-y-2">
      <Label asChild>
        <legend>{label}</legend>
      </Label>
      {children}
    </fieldset>
  );
};
