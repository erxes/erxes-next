import { Skeleton } from 'erxes-ui/components';

import { ContactDetailSelectTag } from '@/contacts/detail/components/ContactDetailSelectTag';
import { useContactDetail } from '@/contacts/detail/hooks/useContactDetail';
import { ContactDetailAssignedTo } from './ContactDetailAssignedTo';
import { ITag } from 
import { TextField } from '@/contacts/customer-edit/components/TextField';

export const ContactGeneral = () => {
  const { customerDetail, loading } = useContactDetail();
  const { primaryEmail, primaryPhone, getTags, ownerId, code, score, _id } =
    customerDetail || {};

  if (loading) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <>
      <div className="py-8 space-y-6">
        <ContactDetailSelectTag tagIds={getTags?.map((tag: ITag) => tag._id)} />
        <ContactDetailAssignedTo ownerId={ownerId} />
        <div className="px-8 space-y-6 font-medium">
          <DataListItem label="Code">
            <TextField
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
            <TextField
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
