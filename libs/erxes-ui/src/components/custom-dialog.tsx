import React from 'react';

import { Dialog, Separator } from 'erxes-ui/components';

interface CustomDialogProps {
  triggerButton: React.ReactNode;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const CustomDialog = ({
  triggerButton,
  title,
  children,
  footer,
}: CustomDialogProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{triggerButton}</Dialog.Trigger>
      <Dialog.Content className="max-w-lg px-0 " aria-describedby={undefined}>
        <Dialog.Header className="flex px-6 flex-col space-y-1.5 text-foreground text-center sm:text-left">
          <Dialog.Title className="text-sm font-semibold leading-none tracking-tight">
            {title}
          </Dialog.Title>
          <Dialog.Close />
        </Dialog.Header>
        <Separator className="w-full" />
        <div className="px-6"> {children}</div>
        <Dialog.Footer className="flex px-6 flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          {footer}
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};
