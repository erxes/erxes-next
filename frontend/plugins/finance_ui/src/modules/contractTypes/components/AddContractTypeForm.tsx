import { Kbd, Sheet, Button } from 'erxes-ui/components';
import {
  usePreviousHotkeyScope,
  useScopedHotkeys,
  useSetHotkeyScope,
} from 'erxes-ui/modules';
import { useState } from 'react';
import { AddContractTypeForm } from '~/modules/contractTypes/components/AddContractType';
import { ContractTypeHotKeyScope } from '~/modules/contractTypes/types';

export const ContractTypeAddSheet = () => {
  const setHotkeyScope = useSetHotkeyScope();
  const [open, setOpen] = useState<boolean>(false);
  const { setHotkeyScopeAndMemorizePreviousScope } = usePreviousHotkeyScope();

  const onOpen = () => {
    setOpen(true);
    setHotkeyScopeAndMemorizePreviousScope(
      ContractTypeHotKeyScope.ContractTypeAddSheet,
    );
  };

  const onClose = () => {
    setHotkeyScope(ContractTypeHotKeyScope.ContractTypesPage);
    setOpen(false);
  };

  useScopedHotkeys(
    `c`,
    () => onOpen(),
    ContractTypeHotKeyScope.ContractTypesPage,
  );
  useScopedHotkeys(
    `esc`,
    () => onClose(),
    ContractTypeHotKeyScope.ContractTypeAddSheet,
  );

  return (
    <Sheet onOpenChange={(open) => (open ? onOpen() : onClose())}>
      <Sheet.Trigger asChild>
        <Button>
          Add Type
          <Kbd>C</Kbd>
        </Button>
      </Sheet.Trigger>
      <Sheet.View
        className="sm:max-w-lg p-0"
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <AddContractTypeForm onOpenChange={setOpen} />
      </Sheet.View>
    </Sheet>
  );
};

export const ContractTypeAddSheetHeader = () => {
  return (
    <Sheet.Header className="border-b gap-3">
      <Sheet.Title>Create Contract Type</Sheet.Title> <Sheet.Close />
    </Sheet.Header>
  );
};
