export const OPERATORS = {
  SET: 'set',
  CONCAT: 'concat',
  ADD: 'add',
  SUBTRACT: 'subtract',
  MULTIPLY: 'multiply',
  DIVIDE: 'divide',
  PERCENT: 'percent',
  ALL: ['set', 'concat', 'add', 'subtract', 'multiply', 'divide', 'percent'],
};

export const staticPlaceholders = {
  '{{ now }}': 0,
  '{{ tomorrow }}': 1,
  '{{ nextWeek }}': 7,
  '{{ nextMonth }}': 30,
};
