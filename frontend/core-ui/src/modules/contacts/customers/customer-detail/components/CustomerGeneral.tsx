import { Skeleton } from 'erxes-ui';

import { ITag } from 'ui-modules';
import { useCustomerDetail } from '../hooks/useCustomerDetail';
import { CustomerDetailSelectTag } from './CustomerDetailSelectTag';
import { TextFieldCustomer } from '../../customer-edit/components/TextField';
import { CustomerDetailAssignedTo } from './CustomerDetailAssignedTo';

export const CustomerGeneral = () => {
  const { customerDetail, loading } = useCustomerDetail();
  const { primaryEmail, primaryPhone, getTags, ownerId, code, score, _id } =
    customerDetail || {};

  if (loading) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <>
      <div className="py-8 space-y-6">
        <CustomerDetailSelectTag
          tagIds={getTags?.map((tag: ITag) => tag._id)}
        />
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
