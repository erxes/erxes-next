import { IconPlus } from '@tabler/icons-react';
import { Button, ScrollArea, Sheet } from 'erxes-ui';
import { useState } from 'react';

import React from 'react';
import ConfigForm from '~/modules/payment/components/ConfigForm';
import KhanBankForm from '~/modules/payment/components/KhanBankForm';
import QuickQrForm from '~/modules/payment/components/QuickQrForm';
import { PAYMENTS } from '~/modules/payment/constants';
import { PaymentKind } from '~/modules/payment/types/PaymentMethods';

type Props = {
  kind: string;
};

const PaymentFormSheet = (props: Props) => {
  const [open, setOpen] = useState(false);
  const payment = PAYMENTS[props.kind as keyof typeof PAYMENTS];

  const renderContent = () => {
    const {inputs = []} = payment;
    switch (props.kind) {
      case PaymentKind.QUICKQR:
        return <QuickQrForm />;
      case PaymentKind.KAHNBANK:
        return <KhanBankForm />;
      default:
        return <ConfigForm inputs={inputs} />;
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Sheet.Trigger asChild>
        <Button className="max-w-fit">
          <IconPlus />
          Add {payment?.name}
        </Button>
      </Sheet.Trigger>
      <ScrollArea>
        <Sheet.View
          className="p-2"
          onEscapeKeyDown={(e) => {
            e.preventDefault();
          }}
        >
          <Sheet.Header>
            <Sheet.Title>Add {payment?.name}</Sheet.Title>
            <Sheet.Close />
          </Sheet.Header>

          <Sheet.Content>{renderContent()}</Sheet.Content>

          <Sheet.Footer>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </Sheet.Footer>
        </Sheet.View>
      </ScrollArea>
    </Sheet>
  );
};

export default PaymentFormSheet;
