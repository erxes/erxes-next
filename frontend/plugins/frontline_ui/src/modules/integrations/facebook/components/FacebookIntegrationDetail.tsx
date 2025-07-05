import { Cell } from '@tanstack/table-core';
import { FacebookMessengerAddSheet } from './FacebookMessengerAdd';
import { IIntegrationDetail } from '@/integrations/types/Integration';
import { Button } from 'erxes-ui';
import { IconEdit } from '@tabler/icons-react';

export const FacebookIntegrationDetail = () => {
  return (
    <div className="">
      <FacebookMessengerAddSheet />
    </div>
  );
};

export const FacebookIntegrationActions = ({
  cell,
}: {
  cell: Cell<IIntegrationDetail, unknown>;
}) => {
  return (
    <Button variant={'outline'}>
      <IconEdit />
    </Button>
  );
};
