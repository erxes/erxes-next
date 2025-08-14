import { IconCircleDashed } from '@tabler/icons-react';
import { IconCircle } from '@tabler/icons-react';
import { IconCircleDot } from '@tabler/icons-react';
import { IconCircleCheck } from '@tabler/icons-react';
import { IconCircleX } from '@tabler/icons-react';
import { TeamStatusTypes } from '@/team/types';

export const TeamStatusIcons = {
  backlog: IconCircleDashed,
  unstarted: IconCircle,
  started: IconCircleDot,
  completed: IconCircleCheck,
  cancelled: IconCircleX,
};

export const DEFAULT_TEAM_STATUSES = [
  {
    label: 'backlog',
    type: TeamStatusTypes.Backlog,
    color: '#6B7280',
    value: '0',
    Icon: IconCircleDashed,
  },
  {
    label: 'todo',
    type: TeamStatusTypes.Unstarted,
    color: '#3B82F6',
    value: '1',
    Icon: IconCircle,
  },
  {
    label: 'in progress',
    type: TeamStatusTypes.Started,
    color: '#F59E0B',
    value: '2',
    Icon: IconCircleDot,
  },
  {
    label: 'done',
    type: TeamStatusTypes.Completed,
    color: '#10B981',
    value: '3',
    Icon: IconCircleCheck,
  },
  {
    label: 'cancelled',
    type: TeamStatusTypes.Cancelled,
    color: '#EF4444',
    value: '4',
    Icon: IconCircleX,
  },
];
