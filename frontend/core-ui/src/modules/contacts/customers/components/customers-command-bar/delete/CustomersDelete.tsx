import { Button } from 'erxes-ui/components';
import { IconTrash } from '@tabler/icons-react';
import { useConfirm } from 'erxes-ui/hooks';
import { useRemoveCustomers } from '@/contacts/customers/hooks/useRemoveCustomers';
import { useToast } from 'erxes-ui';
import { ApolloError } from '@apollo/client';
import { Row } from '@tanstack/table-core';
import { ICustomer } from '@/contacts/types/customerType';

export const CustomersDelete = ({
  customerIds,
  rows,
}: {
  customerIds: string[];
  rows: Row<ICustomer>[];
}) => {
  const { confirm } = useConfirm();
  const { removeCustomers } = useRemoveCustomers();
  const { toast } = useToast();
  return (
    <Button
      variant="secondary"
      className="text-destructive"
      onClick={() =>
        confirm({
          message: `Are you sure you want to delete the ${customerIds.length} selected customers?`,
        }).then(() => {
          removeCustomers(customerIds, {
            onError: (e: ApolloError) => {
              toast({
                title: 'Error',
                description: e.message,
                variant: 'destructive',
              });
            },
            onCompleted: () => {
              rows.forEach((row) => {
                row.toggleSelected(false);
              });
              toast({
                title: 'Success',
                variant: 'default',
              });
            },
          });
        })
      }
    >
      <IconTrash />
      Delete
    </Button>
  );
};
