import { IconPlus } from '@tabler/icons-react';
import {
  Button,
  Form,
  Kbd,
  Sheet,
  usePreviousHotkeyScope,
  useScopedHotkeys,
  useSetHotkeyScope,
  useToast,
} from 'erxes-ui';

import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useTeamCreateForm } from '~/modules/team/hooks/useTeamCreateForm';
import { useTeamCreate } from '~/modules/team/hooks/useTeamCreate';
import { TeamHotKeyScope, TTeamForm } from '@/team/types';
import { CreateTeamForm } from '@/team/components/team-list/CreateTeamForm';

export const CreateTeam = () => {
  const form = useTeamCreateForm();

  const { addTeam, loading } = useTeamCreate();
  const { toast } = useToast();

  const [_open, _setOpen] = useState<boolean>(false);
  const setHotkeyScope = useSetHotkeyScope();
  const { setHotkeyScopeAndMemorizePreviousScope } = usePreviousHotkeyScope();

  const onOpen = () => {
    _setOpen(true);
    setHotkeyScopeAndMemorizePreviousScope(TeamHotKeyScope.TeamCreateSheet);
  };

  const onClose = () => {
    setHotkeyScope(TeamHotKeyScope.TeamSettingsPage);
    _setOpen(false);
  };

  useScopedHotkeys(`c`, () => onOpen(), TeamHotKeyScope.TeamSettingsPage);
  useScopedHotkeys(`esc`, () => onClose(), TeamHotKeyScope.TeamCreateSheet);

  const submitHandler: SubmitHandler<TTeamForm> = React.useCallback(
    async (data) => {
      addTeam({
        variables: data,
        onCompleted: () => {
          toast({ title: 'Success!' });
          form.reset();
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
    [addTeam, toast, _setOpen, form],
  );

  return (
    <Sheet open={_open} onOpenChange={(open) => (open ? onOpen() : onClose())}>
      <Sheet.Trigger asChild>
        <Button>
          <IconPlus />
          Create team
          <Kbd>C</Kbd>
        </Button>
      </Sheet.Trigger>
      <Sheet.View className="p-0">
        <Form {...form}>
          <form
            className="flex flex-col gap-0 size-full"
            onSubmit={form.handleSubmit(submitHandler)}
          >
            <Sheet.Header>
              <Sheet.Title>Add team</Sheet.Title>
              <Sheet.Close />
            </Sheet.Header>
            <Sheet.Content className="grow size-full flex flex-col px-5 py-4">
              <CreateTeamForm form={form} />
            </Sheet.Content>
            <Sheet.Footer>
              <Button variant={'secondary'} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                Create
              </Button>
            </Sheet.Footer>
          </form>
        </Form>
      </Sheet.View>
    </Sheet>
  );
};
