import { createState } from 'erxes-ui';

export const previousUrlState = createState<string>({
  key: 'previousUrlState',
  defaultValue: '',
});
