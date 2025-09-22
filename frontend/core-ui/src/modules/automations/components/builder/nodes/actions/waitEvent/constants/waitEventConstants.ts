export interface WaitEventTypeOption {
  type: 'trigger' | 'action' | 'custom';
  label: string;
}

export const WAIT_EVENT_TYPES: WaitEventTypeOption[] = [
  { type: 'trigger', label: 'Trigger event' },
  { type: 'action', label: 'Action target event' },
  { type: 'custom', label: 'API request' },
];
