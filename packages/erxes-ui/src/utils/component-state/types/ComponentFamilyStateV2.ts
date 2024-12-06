import { ComponentFamilyStateKeyV2 } from './ComponentFamilyStateKeyV2';
import { ComponentStateTypeV2 } from './ComponentStateTypeV2';
import { RecoilState, SerializableParam } from 'recoil';

export type ComponentFamilyStateV2<
  StateType,
  FamilyKey extends SerializableParam
> = {
  type: Extract<ComponentStateTypeV2, 'ComponentFamilyState'>;
  key: string;
  atomFamily: (
    componentFamilyStateKey: ComponentFamilyStateKeyV2<FamilyKey>
  ) => RecoilState<StateType>;
};
