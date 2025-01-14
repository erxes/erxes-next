import { Icon } from '@tabler/icons-react';

export interface Filter {
  accessoryKey: string;
  label: string;
  icon: Icon;
  type: 'input' | 'select' | 'boolean';
  options: { label: string; value: string }[];
  condition;
}
