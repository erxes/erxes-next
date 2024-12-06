import { RecoilState } from 'recoil';

import { RecoilComponentStateKey } from '../types/RecoilComponentStateKey';

export const extractComponentState = <StateType>(
  componentState: (
    componentStateKey: RecoilComponentStateKey
  ) => RecoilState<StateType>,
  scopeId: string
) => {
  return componentState({ scopeId });
};
