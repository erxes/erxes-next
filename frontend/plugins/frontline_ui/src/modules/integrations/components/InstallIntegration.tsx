import { IconCode } from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import { Cell } from '@tanstack/react-table';
import { IIntegrationDetail } from '@/integrations/types/Integration';
import { useSetAtom } from 'jotai';
import { erxesMessengerSetupInstallDialogOpenAtom } from '@/integrations/erxes-messenger/states/erxesMessengerSetupStates';

export const InstallIntegration = ({
  cell,
}: {
  cell: Cell<IIntegrationDetail, unknown>;
}) => {
  const setInstallId = useSetAtom(erxesMessengerSetupInstallDialogOpenAtom);
  return (
    <Button
      variant={'outline'}
      size="icon"
      title="Install Code"
      onClick={() => setInstallId(cell.row.original._id)}
    >
      <IconCode />
    </Button>
  );
};
