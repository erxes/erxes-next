import { RecoilState, SerializableParam } from 'recoil';

import { ComponentFamilyStateKey } from './ComponentFamilyStateKey';

export type ComponentFamilyState<
  StateType,
  FamilyKey extends SerializableParam
> = {
  key: string;
  atomFamily: (
    componentStateKey: ComponentFamilyStateKey<FamilyKey>
  ) => RecoilState<StateType>;
};
