export const STATUS_TYPES = {
  BACKLOG: 'backlog',
  UNSTARTED: 'unstarted',
  STARTED: 'started',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const DEFAULT_STATUSES = [
  {
    name: 'Backlog',
    type: STATUS_TYPES.BACKLOG,
    color: '#FF0000',
    teamId: '',
  },
  {
    name: 'Todo',
    type: STATUS_TYPES.UNSTARTED,
    color: '#FF0000',
  },
  {
    name: 'In Progress',
    type: STATUS_TYPES.STARTED,
    color: '#FF0000',
  },
  {
    name: 'Done',
    type: STATUS_TYPES.COMPLETED,
    color: '#FF0000',
  },
  {
    name: 'Cancelled',
    type: STATUS_TYPES.CANCELLED,
    color: '#FF0000',
  },
];
