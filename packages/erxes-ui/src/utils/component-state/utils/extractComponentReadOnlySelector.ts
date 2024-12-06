import { RecoilValueReadOnly } from 'recoil';

import { RecoilComponentStateKey } from '../types/RecoilComponentStateKey';

export const extractComponentReadOnlySelector = <StateType>(
  componentSelector: (
    componentStateKey: RecoilComponentStateKey
  ) => RecoilValueReadOnly<StateType>,
  scopeId: string
) => {
  return () => componentSelector({ scopeId });
};
