import { IconPlus } from '@tabler/icons-react';
import LabelOverlay from './LabelOverlay';
import { Popover } from 'erxes-ui';

const LabelChooser = () => {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <div className="flex items-center gap-1 min-h-8 cursor-pointer">
          <IconPlus size={16} />
          Add label
        </div>
      </Popover.Trigger>

      <Popover.Content className="w-80">
        <LabelOverlay />
      </Popover.Content>
    </Popover>
  );
};

export default LabelChooser;
