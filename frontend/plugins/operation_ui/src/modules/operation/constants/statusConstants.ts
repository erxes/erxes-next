import {
  IconCircleDashed,
  IconCircle,
  IconCircleDot,
  IconCircleCheck,
  IconCircleX,
} from '@tabler/icons-react';

export const PROJECT_STATUS_OPTIONS = [
  {
    value: 0,
    name: 'Backlog',
    Icon: IconCircleDashed,
    IconColor: '#6B7280',
  },
  {
    value: 1,
    name: 'Todo',
    Icon: IconCircle,
    IconColor: '#3B82F6',
  },
  {
    value: 2,
    name: 'In Progress',
    Icon: IconCircleDot,
    IconColor: '#F59E0B',
  },
  {
    value: 3,
    name: 'Done',
    Icon: IconCircleCheck,
    IconColor: '#10B981',
  },
  {
    value: 4,
    name: 'Cancelled',
    Icon: IconCircleX,
    IconColor: '#EF4444',
  },
];
