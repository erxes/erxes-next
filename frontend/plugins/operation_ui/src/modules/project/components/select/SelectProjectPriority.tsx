import { SelectPriority } from '@/priority/components/SelectPriority';
import { useUpdateProject } from '@/project/hooks/useUpdateProject';

export const SelectProjectPriority = ({
  projectId,
  value,
  inInlineCell = false,
}: {
  projectId: string;
  value?: number;
  inInlineCell?: boolean;
}) => {
  const { updateProject } = useUpdateProject();
  const SelectComponent = inInlineCell
    ? SelectPriority.InlineCell
    : SelectPriority.Detail;
  return (
    <SelectComponent
      value={value}
      onValueChange={(value) =>
        updateProject({
          variables: { _id: projectId, priority: Number(value) },
        })
      }
    />
  );
};
