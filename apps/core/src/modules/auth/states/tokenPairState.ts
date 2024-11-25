import { createState } from 'erxes-ui';

import { cookieStorageEffect } from 'erxes-ui';

export const tokenPairState = createState<any | null>({
  key: 'tokenPairState',
  defaultValue: null,
  effects: [cookieStorageEffect('tokenPair')],
});
