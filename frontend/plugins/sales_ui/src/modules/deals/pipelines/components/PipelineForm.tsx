import { Button, Spinner, Tabs } from 'erxes-ui';

import GeneralForm from '@/deals/boards/components/detail/GeneralForm';
import { IPipeline } from '@/deals/types/pipelines';
import PipelineStages from './PipelineStages';
import { usePipelineDetail } from '@/deals/boards/hooks/usePipelines';

export const PipelineForm = ({ form }: { form: any }) => {
  const { pipelineDetail = {} as IPipeline, loading: pipelineDetailLoading } =
    usePipelineDetail();

  if (pipelineDetailLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <Tabs defaultValue="general" className="flex flex-col h-full shadow-none">
      <Tabs.List className="flex justify-center">
        <Tabs.Trigger asChild value="general">
          <Button
            variant={'outline'}
            className="bg-transparent data-[state=active]:bg-background data-[state=inactive]:shadow-none"
          >
            General
          </Button>
        </Tabs.Trigger>
        <Tabs.Trigger asChild value="stages">
          <Button
            variant={'outline'}
            className="bg-transparent data-[state=active]:bg-background data-[state=inactive]:shadow-none"
          >
            Stages
          </Button>
        </Tabs.Trigger>
        <Tabs.Trigger asChild value="productConfig">
          <Button
            variant={'outline'}
            className="bg-transparent data-[state=active]:bg-background data-[state=inactive]:shadow-none"
          >
            Product config
          </Button>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="general" className="h-full py-4 px-5 overflow-auto">
        <GeneralForm form={form} pipeline={pipelineDetail} />
      </Tabs.Content>
      <Tabs.Content value="stages" className="h-full py-4 px-5 overflow-auto">
        <PipelineStages />
      </Tabs.Content>
      <Tabs.Content
        value="productConfig"
        className="h-full py-4 px-5 overflow-auto"
      >
        hi
      </Tabs.Content>
    </Tabs>
  );
};
