import { ComponentFamilyStateKeyV2 } from './ComponentFamilyStateKeyV2';
import { ComponentStateTypeV2 } from './ComponentStateTypeV2';
import { RecoilState, SerializableParam } from 'recoil';

export type ComponentFamilySelectorV2<
  StateType,
  FamilyKey extends SerializableParam
> = {
  type: Extract<ComponentStateTypeV2, 'ComponentFamilySelector'>;
  key: string;
  selectorFamily: (
    componentFamilyStateKey: ComponentFamilyStateKeyV2<FamilyKey>
  ) => RecoilState<StateType>;
};
