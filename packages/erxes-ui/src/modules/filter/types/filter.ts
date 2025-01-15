import { Icon } from '@tabler/icons-react';

export interface Filter {
  accessoryKey: string;
  label: string;
  icon: Icon;
  type: 'input' | 'select' | 'boolean';
  condition: string;
  dropdown: (
    filter: Omit<Filter, 'dropdown' | 'bar'> & {
      onOpenChange: (open: boolean) => void;
    }
  ) => React.ReactNode;
  bar: (filter: Omit<Filter, 'dropdown' | 'bar'>) => React.ReactNode;
}
