import { Icon } from '@tabler/icons-react';

export const RecordTableInlineHead = (props: { icon: Icon; label: string }) => {
  return (
    <div className="flex items-center gap-1">
      <props.icon className="w-4 h-4" /> {props.label}
    </div>
  );
};
