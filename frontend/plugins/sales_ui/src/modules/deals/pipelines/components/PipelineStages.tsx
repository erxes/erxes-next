import {
  Sortable,
  Props as SortableProps,
} from '@/deals/components/common/Sortable';
import { Spinner, useQueryState } from 'erxes-ui';

import PipelineStageItem from './PipleineStageItem';
import { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useStages } from '@/deals/stage/hooks/useStages';
import { verticalListSortingStrategy } from '@dnd-kit/sortable';

const props: Partial<SortableProps> = {
  strategy: verticalListSortingStrategy,
  itemCount: 10,
};

const PipelineStages = ({ form }: { form: any }) => {
  const [pipelineId] = useQueryState('pipelineId');
  const { control, watch, setValue } = form;

  const { stages: initialStages, loading: stagesLoading } = useStages({
    variables: {
      pipelineId,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'stages',
  });

  useEffect(() => {
    if (initialStages && fields.length === 0) {
      setValue('stages', initialStages, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [initialStages, fields, form, setValue]);

  if (stagesLoading) return <Spinner />;

  const items = (fields || []).map((field) => field.id);

  return (
    <div>
      PipelineStages
      <Sortable
        {...props}
        items={items || []}
        renderItem={({ value, index, ...sortableProps }: any) => {
          const stage = watch('stages')[index];

          return (
            <PipelineStageItem
              {...sortableProps}
              key={value}
              index={index}
              control={control}
              stage={stage}
            />
          );
        }}
      />
    </div>
  );
};

export default PipelineStages;
