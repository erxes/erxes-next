import { Combobox, Label, Switch, Textarea } from 'erxes-ui';
import { CustomerDetailSelectTag } from '@/contacts/customers/customer-detail/components/CustomerDetailSelectTag';
import { TextFieldCustomer } from '@/contacts/customers/customer-edit/components/TextField';
import {
  CustomerEmails,
  CustomerOwner,
  useCustomerEdit,
  CustomerPhones,
} from 'ui-modules';
import { useCustomerDetailWithParams } from '../hooks/useCustomerDetailWithParams';
import { ContactsHotKeyScope } from '@/contacts/types/ContactsHotKeyScope';

export const CustomerGeneral = () => {
  const { customerDetail } = useCustomerDetailWithParams();
  const { customerEdit } = useCustomerEdit();
  if (!customerDetail) return;

  const {
    primaryEmail,
    primaryPhone,
    emails,
    emailValidationStatus,
    tagIds,
    ownerId,
    code,
    _id,
    isSubscribed,
    description,
    score,
    phones,
    phoneValidationStatus,
  } = customerDetail;

  return (
    <>
      <div className="py-8 space-y-6">
        <CustomerDetailSelectTag tagIds={tagIds || []} customerId={_id} />
        <div className="px-8 space-y-2">
          <Label>Owner</Label>
          <CustomerOwner _id={_id} ownerId={ownerId} />
        </div>
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
            <DataListItem label="Emails">
              <CustomerEmails
                _id={_id}
                primaryEmail={primaryEmail || ''}
                emails={emails || []}
                emailValidationStatus={emailValidationStatus || 'valid'}
                Trigger={(props) => <Combobox.TriggerBase {...props} />}
                scope={ContactsHotKeyScope.CustomersPage}
              />
            </DataListItem>
            <DataListItem label="phones">
              <CustomerPhones
                _id={_id}
                primaryPhone={primaryPhone || ''}
                phones={phones || []}
                phoneValidationStatus={phoneValidationStatus || 'valid'}
                scope={ContactsHotKeyScope.CustomersPage}
                Trigger={Combobox.TriggerBase}
              />
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
            <Switch
              checked={isSubscribed === 'Yes'}
              onCheckedChange={(checked) => {
                customerEdit({
                  variables: {
                    _id,
                    isSubscribed: checked ? 'Yes' : 'No',
                  },
                });
              }}
            />
          </DataListItem>
          <DataListItem label="Description">
            <Textarea
              value={description || ''}
              onChange={(e) => {
                customerEdit({
                  variables: {
                    _id,
                    description: e.target.value,
                  },
                });
              }}
            />
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
