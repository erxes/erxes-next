import { SelectMember } from 'ui-modules';
import { Label } from 'erxes-ui';
import { useState } from 'react';
import { useCustomerEdit } from '@/contacts/customers/hooks/useEditCustomer';
import { useToast } from 'erxes-ui';
import { ApolloError } from '@apollo/client';

export const CustomerDetailAssignedTo = ({
  ownerId,
  customerId,
}: {
  ownerId: string | undefined;
  customerId: string;
}) => {
  const [_ownerId, setOwnerId] = useState(ownerId);
  const { customerEdit } = useCustomerEdit();
  const { toast } = useToast();
  return (
    <div className="px-8 space-y-2">
      <Label>Owner</Label>
      <div>
        <SelectMember.Detail
          value={_ownerId}
          onValueChange={(value) => {
            const previousValue = _ownerId;
            setOwnerId(value as string);
            customerEdit({
              variables: {
                _id: customerId,
                ownerId: value as string,
              },
              onError: (e: ApolloError) => {
                setOwnerId(previousValue);
                toast({
                  title: 'Error',
                  description: e.message,
                });
              },
            });
          }}
        />
      </div>
    </div>
  );
};
