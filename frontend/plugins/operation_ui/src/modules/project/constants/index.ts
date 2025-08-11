import {
  IconAntennaBars1,
  IconAntennaBars2,
  IconAntennaBars3,
  IconAntennaBars4,
  IconAntennaBars5,
  IconCircleDashed,
  IconCircle,
  IconCircleDot,
  IconCircleCheck,
  IconCircleX,
} from '@tabler/icons-react';
export const PROJECTS_CURSOR_SESSION_KEY = 'projects_cursor_session_key';

export const PROJECT_PRIORITIES_OPTIONS = [
  {
    value: 0,
    name: 'No Priority',
    Icon: IconAntennaBars1,
    IconColor: '#000000',
  },
  { value: 1, name: 'Minor', Icon: IconAntennaBars2, IconColor: '#10B981' },
  { value: 2, name: 'Medium', Icon: IconAntennaBars3, IconColor: '#3B82F6' },
  { value: 3, name: 'High', Icon: IconAntennaBars4, IconColor: '#F59E0B' },
  { value: 4, name: 'Critical', Icon: IconAntennaBars5, IconColor: '#EF4444' },
];

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





export * from './ProjectHotKeyScope';