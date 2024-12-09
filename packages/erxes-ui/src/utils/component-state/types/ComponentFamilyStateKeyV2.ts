import { ComponentStateKeyV2 } from './ComponentStateKeyV2';
import { SerializableParam } from 'recoil';

export type ComponentFamilyStateKeyV2<FamilyKey extends SerializableParam> =
  ComponentStateKeyV2 & {
    familyKey: FamilyKey;
  };
