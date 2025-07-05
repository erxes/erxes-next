import { Button, Spinner, toast, useConfirm } from 'erxes-ui';
import { IconTrash } from '@tabler/icons-react';
import { REMOVE_INTEGRATION } from '@/integrations/graphql/mutations/RemoveIntegration';
import { useMutation } from '@apollo/client';

export const RemoveIntegration = ({
  _id,
  name,
}: {
  _id: string;
  name: string;
}) => {
  const [removeIntegration, { loading }] = useMutation(REMOVE_INTEGRATION, {
    refetchQueries: ['Integrations'],
    onCompleted() {
      toast({
        title: 'Integration removed',
        variant: 'default',
      });
    },
    onError() {
      toast({
        title: 'Integration removed',
        variant: 'destructive',
      });
    },
  });

  const { confirm } = useConfirm();

  return (
    <Button
      variant={'outline'}
      className="text-destructive bg-destructive/10"
      onClick={() =>
        confirm({
          message: `Are you sure you want to remove "${name}" integration?`,
        }).then(() => {
          removeIntegration({ variables: { id: _id } });
        })
      }
      disabled={loading}
    >
      {loading ? <Spinner size="small" /> : <IconTrash />}
    </Button>
  );
};
