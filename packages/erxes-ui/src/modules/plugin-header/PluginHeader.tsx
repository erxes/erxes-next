import { IconStar, type Icon } from '@tabler/icons-react';
import { Sidebar } from 'erxes-ui/components';

export const PluginHeader = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: Icon;
  children?: React.ReactNode;
}) => {
  const Icon = icon;
  return (
    <header className="flex items-center justify-between h-12 border-b border-input -mx-3 px-3">
      <div className="flex items-center gap-2">
        <Sidebar.Trigger />
        <span className="h-3 w-0.5 bg-muted rounded-sm" />
        <div className="flex items-center gap-2 px-2">
          <Icon className="w-4 h-4" />
          <span className="text-[13px] font-semibold leading-none">
            {title}
          </span>
        </div>
        <span className="h-3 w-0.5 bg-muted rounded-sm" />
        <IconStar className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex items-center gap-3">{children}</div>
    </header>
  );
};
