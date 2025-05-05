import { Skeleton } from 'erxes-ui';

import { useCustomerDetail } from '@/contacts/customers/customer-detail/hooks/useCustomerDetail';
import { CustomerDetailSelectTag } from '@/contacts/customers/customer-detail/components/CustomerDetailSelectTag';
import { TextFieldCustomer } from '@/contacts/customers/customer-edit/components/TextField';
import { CustomerDetailAssignedTo } from '@/contacts/customers/customer-detail/components/CustomerDetailAssignedTo';

export const CustomerGeneral = () => {
  const { customerDetail, loading } = useCustomerDetail();
  const { primaryEmail, primaryPhone, tagIds, ownerId, code, score, _id } =
    customerDetail || {};

  if (loading) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <>
      <div className="py-8 space-y-6">
        <CustomerDetailSelectTag tagIds={tagIds} customerId={_id} />
        <CustomerDetailAssignedTo ownerId={ownerId} />
        <div className="px-8 space-y-6 font-medium">
          <DataListItem label="Code">
            <TextFieldCustomer
              value={code}
              placeholder="Add Code"
              className="text-sm"
              field="code"
              _id={_id}
            />
          </DataListItem>
          <DataListItem label="Primary Email">{primaryEmail}</DataListItem>
          <DataListItem label="Primary Phone">{primaryPhone}</DataListItem>
          <DataListItem label="Score">
            <TextFieldCustomer
              value={score}
              placeholder="Add Score"
              className="text-sm"
              field="score"
              _id={_id}
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
    <div className="flex gap-1 leading-4 items-center">
      <div className="w-32 text-muted-foreground/70">{label}</div>
      {children ? (
        children
      ) : (
        <div className="text-muted-foreground/50 select-none">{'Empty'}</div>
      )}
    </div>
  );
};
