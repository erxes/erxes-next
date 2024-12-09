import { ComponentStateKeyV2 } from './ComponentStateKeyV2';
import { ComponentStateTypeV2 } from './ComponentStateTypeV2';
import { RecoilValueReadOnly } from 'recoil';

export type ComponentReadOnlySelectorV2<StateType> = {
  type: Extract<ComponentStateTypeV2, 'ComponentReadOnlySelector'>;
  key: string;
  selectorFamily: (
    componentStateKey: ComponentStateKeyV2
  ) => RecoilValueReadOnly<StateType>;
};
