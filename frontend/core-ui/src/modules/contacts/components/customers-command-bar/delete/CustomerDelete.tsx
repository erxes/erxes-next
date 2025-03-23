import { Button } from 'erxes-ui/components';
import { IconTrash } from '@tabler/icons-react';
import { useConfirm } from 'erxes-ui/hooks';
import { useRemoveCustomers } from '@/contacts/hooks/useRemoveCustomers';
import { useToast } from 'erxes-ui';
import { ApolloError } from '@apollo/client';

export const CustomerDelete = ({ customerIds }: { customerIds: string[] }) => {
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
          });
        })
      }
    >
      <IconTrash />
      Delete
    </Button>
  );
};
