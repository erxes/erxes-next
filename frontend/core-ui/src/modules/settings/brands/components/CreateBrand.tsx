import { IconChessKnight, IconPlus } from '@tabler/icons-react';
import {
  Button,
  Form,
  Sheet,
  usePreviousHotkeyScope,
  useScopedHotkeys,
  useSetHotkeyScope,
  useToast,
} from 'erxes-ui';
import React, { useState } from 'react';
import { useBrandsForm } from '../hooks/useBrandsForm';
import { useBrandsAdd } from '../hooks/useBrandsAdd';
import { SubmitHandler } from 'react-hook-form';
import { BrandsForm } from './BrandsForm';
import { BrandsHotKeyScope, TBrandsForm } from '../types';

export const CreateBrand = () => {
  const { toast } = useToast();
  const { brandsAdd, loading } = useBrandsAdd();
  const {
    methods,
    methods: { reset, handleSubmit },
  } = useBrandsForm();

  const [_open, _setOpen] = useState<boolean>(false);
  const setHotkeyScope = useSetHotkeyScope();
  const { setHotkeyScopeAndMemorizePreviousScope } = usePreviousHotkeyScope();

  const onOpen = () => {
    _setOpen(true);
    setHotkeyScopeAndMemorizePreviousScope(BrandsHotKeyScope.BrandsCreateSheet);
  };

  const onClose = () => {
    setHotkeyScope(BrandsHotKeyScope.BrandsSettingsPage);
    _setOpen(false);
  };

  useScopedHotkeys(`c`, () => onOpen(), BrandsHotKeyScope.BrandsSettingsPage);
  useScopedHotkeys(`esc`, () => onClose(), BrandsHotKeyScope.BrandsCreateSheet);

  const submitHandler: SubmitHandler<TBrandsForm> = React.useCallback(
    async (data) => {
      brandsAdd({
        variables: data,
        onCompleted: () => {
          toast({ title: 'Success!' });
          reset();
          _setOpen(false);
        },
        onError: (error) =>
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          }),
      });
    },
    [brandsAdd],
  );

  return (
    <Sheet open={_open} onOpenChange={(open) => (open ? onOpen() : onClose())}>
      <Sheet.Trigger asChild>
        <Button>
          <IconPlus />
          Create brand
          <kbd>C</kbd>
        </Button>
      </Sheet.Trigger>
      <Sheet.View className="p-0">
        <Form {...methods}>
          <form
            className="flex flex-col gap-0 size-full"
            onSubmit={handleSubmit(submitHandler)}
          >
            <Sheet.Header>
              <IconChessKnight />
              <Sheet.Title>Create brand</Sheet.Title>
              <Sheet.Close />
            </Sheet.Header>
            <Sheet.Content className="grow size-full flex flex-col px-5 py-4">
              <BrandsForm />
            </Sheet.Content>
            <Sheet.Footer>
              <Button variant={'secondary'}>Cancel</Button>
              <Button type="submit">Create</Button>
            </Sheet.Footer>
          </form>
        </Form>
      </Sheet.View>
    </Sheet>
  );
};
