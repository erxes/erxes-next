import { ComponentStateKeyV2 } from './ComponentStateKeyV2';
import { ComponentStateTypeV2 } from './ComponentStateTypeV2';
import { RecoilState } from 'recoil';

export type ComponentSelectorV2<StateType> = {
  type: Extract<ComponentStateTypeV2, 'ComponentSelector'>;
  key: string;
  selectorFamily: (
    componentStateKey: ComponentStateKeyV2
  ) => RecoilState<StateType>;
};
