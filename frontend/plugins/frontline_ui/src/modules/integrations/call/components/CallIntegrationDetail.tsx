import { Cell } from '@tanstack/table-core';
import { IIntegrationDetail } from '@/integrations/types/Integration';
import { Button } from 'erxes-ui';
import { IconEdit } from '@tabler/icons-react';
import { useSetAtom } from 'jotai';
import { callEditSheetAtom } from '@/integrations/call/states/callEditSheetAtom';
import { CallIntegrationSheetEdit } from '@/integrations/call/components/CallIntegrationEdit';
import { CallIntegrationAddSheet } from '@/integrations/call/components/CallIntegrationAdd';

export const CallIntegrationDetail = () => {
  return (
    <div>
      <CallIntegrationAddSheet />
      <CallIntegrationSheetEdit />
    </div>
  );
};

export const CallIntegrationActions = ({
  cell,
}: {
  cell: Cell<IIntegrationDetail, unknown>;
}) => {
  const setEditId = useSetAtom(callEditSheetAtom);
  return (
    <Button
      variant={'outline'}
      size="icon"
      onClick={() => setEditId(cell.row.original._id)}
    >
      <IconEdit />
    </Button>
  );
};
