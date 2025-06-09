import { CustomNode } from '../slot/types';

export const ALLOW_TYPES = [
  { value: 'eat', label: 'Eat', kind: 'sale' },
  { value: 'take', label: 'Take', kind: 'sale' },
  { value: 'delivery', label: 'Delivery', kind: 'sale' },
  { value: 'loss', label: 'Loss', kind: 'out' },
  { value: 'spend', label: 'Spend', kind: 'out' },
  { value: 'reject', label: 'Reject', kind: 'out' },
];

export const ALLOW_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'doing', label: 'Doing' },
  { value: 'reDoing', label: 'Redoing' },
  { value: 'done', label: 'Done' },
  { value: 'complete', label: 'Complete' },
  { value: 'pending', label: 'Pending' },
  { value: 'return', label: 'Return' },
];

export const FILTER_PARAMS = [
  'search',
  'customerId',
  'customerType',
  'billType',
  'registerNumber',
  'type',
  'createdStartDate',
  'createdEndDate',
  'paidStartDate',
  'paidEndDate',
  'financeStartDate',
  'financeEndDate',
  'paidDate',
  'userId',
  'hasntUser',
];

export const SCREEN_TYPE_OPTIONS = [
  { label: 'Time', value: 'time' },
  { label: 'Manual', value: 'manual' }, // used only in kitchen
  { label: 'Count', value: 'count' }, // used only in waiting
];
//kitchen status change
export const KITCHEN_TYPE_OPTIONS = [
  { label: 'Time', value: 'time' },
  { label: 'Manual', value: 'manual' },
];
//waiting change type
export const WAITING_TYPE_OPTIONS = [
  { label: 'Time', value: 'time' },
  { label: 'Count', value: 'count' },
];
// kitchen show types
export const SHOW_TYPE_OPTIONS = [
  { label: 'All saved orders', value: 'all' },
  { label: 'Paid all orders', value: 'paid' },
  // { label: "Orders containing certain products", value: "filtered" }, // optional/future
  { label: 'Defined orders only', value: 'click' },
];
export const options = [
  { value: 'debtAmount', label: 'Зээлийн данс' },
  { value: 'cashAmount', label: 'Бэлэн мөнгө данс' },
  { value: 'cardAmount', label: 'Картын данс' },
  { value: 'card2Amount', label: 'Картын данс нэмэлт' },
  { value: 'mobileAmount', label: 'Мобайл данс' },
  { value: 'debtBarterAmount', label: 'Бартер данс' },
];

export const DefaultNode: CustomNode = {
  id: '1',
  type: 'tableNode',
  position: { x: 250, y: 100 },
  data: {
    label: 'TABLE 1',
    code: '01',
    color: '#4F46E5',
    width: 80,
    height: 80,
    positionX: 250,
    positionY: 100,
    rounded: false,
    rotateAngle: 0,
    zIndex: 0,
    disabled: false,
  },
};

