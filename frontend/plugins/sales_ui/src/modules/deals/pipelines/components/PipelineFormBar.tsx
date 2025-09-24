import { Button, Form, Sheet, Spinner, useToast } from 'erxes-ui';
import { IconGitBranch, IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { PipelineForm } from './PipelineForm';
import { PipelineHotKeyScope } from '@/deals/types/pipelines';
import { TPipelineForm } from '@/deals/types/pipelines';
import { usePipelineAdd } from '@/deals/boards/hooks/usePipelines';
import { usePipelineDetail } from '@/deals/boards/hooks/usePipelines';
import { usePipelineForm } from '@/deals/boards/hooks/usePipelineForm';
import { usePreviousHotkeyScope } from 'erxes-ui';
import { useScopedHotkeys } from 'erxes-ui';
import { useSetHotkeyScope } from 'erxes-ui';

export function PipelineFormBar() {
  const {
    methods,
    methods: { reset, handleSubmit },
  } = usePipelineForm();

  const { toast } = useToast();
  const [open, setOpen] = useState<boolean>(false);

  const { addPipeline, loading } = usePipelineAdd();

  const setHotkeyScope = useSetHotkeyScope();
  const { setHotkeyScopeAndMemorizePreviousScope } = usePreviousHotkeyScope();

  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const pipelineId = searchParams.get('pipelineId');

  const { pipelineDetail } = usePipelineDetail();
  console.log('ppppp', pipelineDetail);
  const submitHandler = (data: TPipelineForm) => {
    console.log('ddd', data);
    // addPipeline({
    //   variables: data,
    //   onCompleted: () => {
    //     toast({ title: 'Pipeline added successfully.' });
    //     reset();
    //     setOpen(false);
    //   },
    // });
  };

  const onOpen = () => {
    setOpen(true);
    setHotkeyScopeAndMemorizePreviousScope(
      PipelineHotKeyScope.PipelineAddSheet,
    );
  };

  const onClose = () => {
    setHotkeyScope(PipelineHotKeyScope.PipelineSettingsPage);
    setOpen(false);

    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('pipelineId');
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    });
  };

  useEffect(() => {
    if (pipelineId) {
      onOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, pipelineId]);

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

  const title = pipelineId ? 'Edit Pipeline' : 'Add Pipeline';

  useEffect(() => {
    if (!pipelineDetail) return;
    reset({
      name: pipelineDetail?.name,
      visibility: pipelineDetail?.visibility,
      boardId: pipelineDetail?.boardId,
      tagId: pipelineDetail?.tagId,
      departmentIds: pipelineDetail?.departmentIds,
      branchIds: pipelineDetail?.branchIds,
      memberIds: pipelineDetail?.memberIds,
    });
  }, [pipelineDetail, reset]);

  return (
    <div className="ml-auto flex items-center gap-3">
      <Sheet onOpenChange={(open) => (open ? onOpen() : onClose())} open={open}>
        <Sheet.Trigger asChild>
          <Button>
            <IconPlus /> {title}
          </Button>
        </Sheet.Trigger>
        <Sheet.View
          className="p-0 md:max-w-screen-2xl"
          onEscapeKeyDown={(e) => {
            e.preventDefault();
          }}
        >
          <Form {...methods}>
            <form
              onSubmit={handleSubmit(submitHandler)}
              className=" flex flex-col gap-0 w-full h-full"
            >
              <Sheet.Header>
                <Sheet.Title className="text-lg text-foreground flex items-center gap-1">
                  <IconGitBranch size={16} />
                  {title}
                </Sheet.Title>
                <Sheet.Close />
              </Sheet.Header>
              <Sheet.Content className="grow size-full h-auto flex flex-col overflow-hidden">
                <PipelineForm form={methods} />
              </Sheet.Content>
              <Sheet.Footer>
                <Button variant={'ghost'} onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? <Spinner /> : 'Create'}
                </Button>
              </Sheet.Footer>
            </form>
          </Form>
        </Sheet.View>
      </Sheet>
    </div>
  );
}
