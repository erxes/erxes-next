import { Icon } from '@tabler/icons-react';

export interface Filter {
  accessoryKey: string;
  label: string;
  icon: Icon;
  dropdown: (filter: FilterDropdownProps) => React.ReactNode;
  bar: (filter: FilterBarComponentPropsBase) => React.ReactNode;
  condition: (filter: FilterBarComponentPropsBase) => React.ReactNode;
}

export type FilterBarComponentPropsBase = Omit<
  Filter,
  'dropdown' | 'bar' | 'conditions'
>;
export interface FilterDropdownProps extends FilterBarComponentPropsBase {
  onOpenChange: (open: boolean) => void;
}
