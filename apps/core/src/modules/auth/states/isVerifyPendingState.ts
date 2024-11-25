import { createState } from 'erxes-ui';
export const isVerifyPendingState = createState<boolean>({
  key: 'isVerifyPendingState',
  defaultValue: false,
});
