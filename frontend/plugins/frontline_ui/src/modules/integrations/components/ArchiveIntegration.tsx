import { Button, Spinner, toast, useConfirm } from 'erxes-ui';
import { IconArchive } from '@tabler/icons-react';
import { useMutation } from '@apollo/client';
import { ARCHIVE_INTEGRATION } from '@/integrations/graphql/mutations/ArchiveIntegration';

export const ArchiveIntegration = ({
  _id,
  name,
}: {
  _id: string;
  name: string;
}) => {
  const { confirm } = useConfirm();
  const [archiveIntegration, { loading }] = useMutation(ARCHIVE_INTEGRATION, {
    refetchQueries: ['Integrations'],
    onCompleted() {
      toast({
        title: 'Integration archived',
        variant: 'default',
      });
    },
    onError(e) {
      toast({
        title: 'Integration archived',
        variant: 'destructive',
      });
    },
  });

  return (
    <Button
      variant={'outline'}
      onClick={() =>
        confirm({
          message: `Are you sure you want to archive "${name}" integration?`,
        }).then(() => {
          archiveIntegration({ variables: { id: _id, status: true } });
        })
      }
      disabled={loading}
    >
      {loading ? <Spinner size="small" /> : <IconArchive />}
    </Button>
  );
};
