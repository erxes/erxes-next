import { SelectPriority } from '@/priority/components/SelectPriority';
import { useUpdateTask } from '@/task/hooks/useUpdateTask';

export const SelectTaskPriority = ({
  taskId,
  value,
  inInlineCell = false,
}: {
  taskId: string;
  value?: number;
  inInlineCell?: boolean;
}) => {
  const { updateTask } = useUpdateTask();
  const SelectComponent = inInlineCell
    ? SelectPriority.InlineCell
    : SelectPriority.Detail;
  return (
    <SelectComponent
      value={value}
      onValueChange={(value) =>
        updateTask({
          variables: { _id: taskId, priority: Number(value) },
        })
      }
    />
  );
};
