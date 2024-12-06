import { RecoilState } from 'recoil';

import { RecoilComponentStateKey } from '../types/RecoilComponentStateKey';

export const extractComponentSelector = <StateType>(
  componentSelector: (
    componentStateKey: RecoilComponentStateKey
  ) => RecoilState<StateType>,
  scopeId: string
) => {
  return () => componentSelector({ scopeId });
};
