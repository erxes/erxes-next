export const STATUS_TYPES = {
  BACKLOG: 'backlog',
  UNSTARTED: 'unstarted',
  STARTED: 'started',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const DEFAULT_STATUSES = [
  {
    name: 'backlog',
    type: STATUS_TYPES.BACKLOG,
    color: '#000000',
    order: 0,
  },
  {
    name: 'haha',
    type: STATUS_TYPES.BACKLOG,
    color: '#000000',
    order: 0,
  },
  {
    name: 'todo',
    type: STATUS_TYPES.UNSTARTED,
    color: '#000000',
    order: 0,
  },
  {
    name: 'in progress',
    type: STATUS_TYPES.STARTED,
    color: '#000000',
    order: 0,
  },
  {
    name: 'done',
    type: STATUS_TYPES.COMPLETED,
    color: '#000000',
    order: 0,
  },
  {
    name: 'cancelled',
    type: STATUS_TYPES.CANCELLED,
    color: '#000000',
    order: 0,
  },
];
