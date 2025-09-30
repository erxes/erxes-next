import {
  Sortable,
  Props as SortableProps,
} from '@/deals/components/common/Sortable';

import PipelineStageItem from './PipleineStageItem';
import { Spinner } from 'erxes-ui';
import { useFieldArray } from 'react-hook-form';
import { verticalListSortingStrategy } from '@dnd-kit/sortable';

const props: Partial<SortableProps> = {
  strategy: verticalListSortingStrategy,
  itemCount: 10,
};

type Props = {
  form: any;
  stagesLoading: boolean;
};

const PipelineStages = ({ form, stagesLoading }: Props) => {
  const { control } = form;

  const { fields } = useFieldArray({
    control,
    name: 'stages',
  });

  if (stagesLoading) return <Spinner />;

  const items = (fields || []).map((field) => field.id);

  return (
    <div>
      <Sortable
        {...props}
        items={items || []}
        renderItem={({ value, index, ...sortableProps }: any) => {
          return (
            <PipelineStageItem
              {...sortableProps}
              key={value}
              index={index}
              control={control}
              stage={fields[index]}
            />
          );
        }}
      />
    </div>
  );
};

export default PipelineStages;
