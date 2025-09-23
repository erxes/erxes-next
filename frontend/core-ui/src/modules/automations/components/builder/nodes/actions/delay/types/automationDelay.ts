export type TAutomationDelayIntervalType =
  | 'minute'
  | 'hour'
  | 'day'
  | 'month'
  | 'year'
  | undefined;

export type TAutomationDelayConfig = {
  value: number;
  type: TAutomationDelayIntervalType;
};
