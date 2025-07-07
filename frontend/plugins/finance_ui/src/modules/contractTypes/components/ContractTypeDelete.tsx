import { ApolloError } from '@apollo/client';
import { IconTrash } from '@tabler/icons-react';
import { Button, useConfirm, useToast } from 'erxes-ui';
import { useRemoveContractTypes } from '~/modules/contractTypes/hooks/useRemoveContractTypes';

interface ContractTypesDeleteProps {
  contractTypeIds: string;
  onDeleteSuccess?: () => void;
}

export const ContractTypesDelete = ({
  contractTypeIds,
  onDeleteSuccess,
}: ContractTypesDeleteProps) => {
  const { confirm } = useConfirm();
  const { removeContractType } = useRemoveContractTypes();
  const { toast } = useToast();

  const typeCount = contractTypeIds.includes(',')
    ? contractTypeIds.split(',').length
    : 1;

  return (
    <Button
      variant="secondary"
      className="text-destructive"
      onClick={() =>
        confirm({
          message: `Are you sure you want to delete the ${typeCount} selected types.`,
        }).then(() => {
          removeContractType(contractTypeIds, {
            onError: (e: ApolloError) => {
              toast({
                title: 'Error',
                description: e.message,
                variant: 'destructive',
              });
            },

            onCompleted: () => {
              toast({
                title: 'Success',
                description: `${typeCount} ${
                  typeCount === 1 ? 'type' : 'types'
                } deleted successfully.`,
              });

              if (onDeleteSuccess) {
                onDeleteSuccess();
              }
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
