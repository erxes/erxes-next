import { Popover, Combobox, Command } from 'erxes-ui';
import { IBranch } from '../types/Branch';
import { useBranches } from '../hooks/useBranches';

export const SelectBranch = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <Popover>
      <Popover.Trigger>
        <Combobox>{value || 'Select Branch'}</Combobox>
      </Popover.Trigger>
      <Popover.Content>
        <BranchesList />
      </Popover.Content>
    </Popover>
  );
};

export const BranchesList = () => {
  const { branches, loading } = useBranches();
  return (
    <Command>
      <Command.Input placeholder="Search branch" />
      <Command.List>
        <Command.Empty>{loading && <Command.Skeleton />}</Command.Empty>
        {branches?.map((branch: IBranch) => (
          <Command.Item key={branch._id} value={branch._id}>
            {branch.name}
          </Command.Item>
        ))}
      </Command.List>
    </Command>
  );
};
