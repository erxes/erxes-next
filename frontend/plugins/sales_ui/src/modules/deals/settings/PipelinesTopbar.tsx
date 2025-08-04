import { Button, Form, Kbd, Sheet } from 'erxes-ui';
import { IconGitBranch, IconPlus } from '@tabler/icons-react';

import { PipelineForm } from '@/deals/boards/components/PipelineForm';
import { PipelineHotKeyScope } from '@/deals/types/pipelines';
// import { SubmitHandler } from 'react-hook-form';
import React from 'react';
import { usePipelineForm } from '@/deals/boards/hooks/usePipelineForm';
import { usePreviousHotkeyScope } from 'erxes-ui';
import { useScopedHotkeys } from 'erxes-ui';
import { useSetHotkeyScope } from 'erxes-ui';
import { useState } from 'react';

export function PipelinesTopbar() {
  const {
    methods,
    // methods: { handleSubmit },
  } = usePipelineForm();
  const [open, setOpen] = useState<boolean>(false);
  // const { handleAdd, loading } = usePipelineAdd();
  // const { toast } = useToast();
  const setHotkeyScope = useSetHotkeyScope();
  const { setHotkeyScopeAndMemorizePreviousScope } = usePreviousHotkeyScope();

  const onOpen = () => {
    setOpen(true);
    setHotkeyScopeAndMemorizePreviousScope(
      PipelineHotKeyScope.PipelineAddSheet,
    );
  };

  const onClose = () => {
    setHotkeyScope(PipelineHotKeyScope.PipelineSettingsPage);
    setOpen(false);
  };

  useScopedHotkeys(
    `c`,
    () => onOpen(),
    PipelineHotKeyScope.PipelineSettingsPage,
  );
  useScopedHotkeys(
    `esc`,
    () => onClose(),
    PipelineHotKeyScope.PipelineAddSheet,
  );

  // const submitHandler: SubmitHandler<TBranchForm> = React.useCallback(
  //   async (data) => {
  //     handleAdd({
  //       variables: data,
  //       onCompleted: () => {
  //         toast({ title: 'Success!' });
  //         methods.reset();
  //         setOpen(false);
  //       },
  //       onError: (error) =>
  //         toast({
  //           title: 'Error',
  //           description: error.message,
  //           variant: 'destructive',
  //         }),
  //     });
  //   },
  //   [handleAdd],
  // );

  return (
    <div className="ml-auto flex items-center gap-3">
      <Sheet onOpenChange={(open) => (open ? onOpen() : onClose())} open={open}>
        <Sheet.Trigger asChild>
          <Button>
            <IconPlus /> Create Branch
            <Kbd>C</Kbd>
          </Button>
        </Sheet.Trigger>
        <Sheet.View
          className="p-0"
          onEscapeKeyDown={(e) => {
            e.preventDefault();
          }}
        >
          <Form {...methods}>
            <form
              // onSubmit={handleSubmit(submitHandler)}
              className=" flex flex-col gap-0 w-full h-full"
            >
              <Sheet.Header>
                <Sheet.Title className="text-lg text-foreground flex items-center gap-1">
                  <IconGitBranch size={16} />
                  Create branch
                </Sheet.Title>
                <Sheet.Close />
              </Sheet.Header>
              <Sheet.Content className="grow size-full h-auto flex flex-col px-5 py-4">
                <PipelineForm />
              </Sheet.Content>
              <Sheet.Footer>
                <Button variant={'ghost'} onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                {/* <Button type="submit" disabled={loading}>
                {loading ? <Spinner /> : 'Create'}
              </Button> */}
              </Sheet.Footer>
            </form>
          </Form>
        </Sheet.View>
      </Sheet>
    </div>
  );
}
