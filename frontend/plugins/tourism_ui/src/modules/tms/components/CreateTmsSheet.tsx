import { IconPlus } from '@tabler/icons-react';
import { Button, Sheet } from 'erxes-ui';
import { useState } from 'react';
import CreateTmsForm from '@/tms/components/CreateTmsForm';
import { useSetAtom } from 'jotai';
import { currentStepAtom } from '~/modules/tms/states/tmsInformationFieldsAtoms';

export const TmsCreateSheet = () => {
  const [open, setOpen] = useState<boolean>(false);
  const setCurrentStep = useSetAtom(currentStepAtom);

  const handleOpenChange = (openState: boolean) => {
    setOpen(openState);
    setCurrentStep(1);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <Sheet.Trigger asChild>
        <Button>
          <IconPlus />
          Create TMS
        </Button>
      </Sheet.Trigger>
      <Sheet.View
        className="p-0 sm:max-w-8xl"
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <CreateTmsForm onOpenChange={setOpen} />
      </Sheet.View>
    </Sheet>
  );
};

export const TmsCreateSheetHeader = () => {
  return (
    <Sheet.Header className="p-5 border">
      <Sheet.Title>Create Tour Management System</Sheet.Title>
      <Sheet.Close />
    </Sheet.Header>
  );
};
