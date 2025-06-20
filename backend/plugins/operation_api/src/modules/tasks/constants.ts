export const VISIBILITIES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  ALL: ['public', 'private'],
};

export const HACK_SCORING_TYPES = {
  RICE: 'rice',
  ICE: 'ice',
  PIE: 'pie',
  ALL: ['rice', 'ice', 'pie'],
};

export const PROBABILITY = {
  TEN: '10%',
  TWENTY: '20%',
  THIRTY: '30%',
  FOURTY: '40%',
  FIFTY: '50%',
  SIXTY: '60%',
  SEVENTY: '70%',
  EIGHTY: '80%',
  NINETY: '90%',
  WON: 'Won',
  LOST: 'Lost',
  DONE: 'Done',
  RESOLVED: 'Resolved',
  ALL: [
    '10%',
    '20%',
    '30%',
    '40%',
    '50%',
    '60%',
    '70%',
    '80%',
    '90%',
    'Won',
    'Lost',
    'Done',
    'Resolved',
  ],
};

export const TASK_STATUSES = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  ALL: ['active', 'archived'],
};

export const TIME_TRACK_TYPES = {
  STARTED: 'started',
  STOPPED: 'stopped',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  ALL: ['started', 'stopped', 'paused', 'completed'],
};

export const CLOSE_DATE_TYPES = {
  NEXT_DAY: 'nextDay',
  NEXT_WEEK: 'nextWeek',
  NEXT_MONTH: 'nextMonth',
  NO_CLOSE_DATE: 'noCloseDate',
  OVERDUE: 'overdue',
  ALL: [
    {
      name: 'Next day',
      value: 'nextDay',
    },
    {
      name: 'Next week',
      value: 'nextWeek',
    },
    {
      name: 'Next month',
      value: 'nextMonth',
    },
    {
      name: 'No close date',
      value: 'noCloseDate',
    },
    {
      name: 'Over due',
      value: 'overdue',
    },
  ],
};
