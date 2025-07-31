import { IconPlus } from '@tabler/icons-react';
import {
  Button,
  Form,
  Kbd,
  Sheet,
  usePreviousHotkeyScope,
  useScopedHotkeys,
  useSetHotkeyScope,
} from 'erxes-ui';
import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useTeamForm } from '@/team/hooks/useTeamForm';
import { TeamHotKeyScope, TTeamForm } from '@/team/types';
import { CreateTeamForm } from '@/team/components/team-list/CreateTeamForm';

export const CreateTeam = () => {
  const { methods } = useTeamForm();

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
      console.log(data);
    },
    [],
  );

  console.log(Form);

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
        <Form {...methods}>
          <form
            className="flex flex-col gap-0 size-full"
            onSubmit={methods.handleSubmit(submitHandler)}
          >
            <Sheet.Header>
              <Sheet.Title>Add team</Sheet.Title>
              <Sheet.Close />
            </Sheet.Header>
            <Sheet.Content className="grow size-full flex flex-col px-5 py-4">
              <CreateTeamForm />
            </Sheet.Content>
            <Sheet.Footer>
              <Button variant={'secondary'} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </Sheet.Footer>
          </form>
        </Form>
      </Sheet.View>
    </Sheet>
  );
};
