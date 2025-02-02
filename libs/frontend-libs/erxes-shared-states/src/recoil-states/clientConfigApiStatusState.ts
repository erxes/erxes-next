import { createState } from './createState'

type ApiStatus = {
  isLoaded: boolean;
  isErrored: boolean;
  error?: Error;
};

export const clientConfigApiStatusState = createState<ApiStatus>({
  key: 'clientConfigApiStatusState',
  defaultValue: { isLoaded: false, isErrored: false, error: undefined },
});
