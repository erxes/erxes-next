import { ComponentFamilyStateKeyV2 } from '../types/ComponentFamilyStateKeyV2';
import { ComponentFamilyStateV2 } from '../types/ComponentFamilyStateV2';
import { ComponentInstanceStateContext } from '../types/ComponentInstanceStateContext';
import { globalComponentInstanceContextMap } from './globalComponentInstanceContextMap';
import { AtomEffect, atomFamily, SerializableParam } from 'recoil';

import { isDefined } from 'twenty-ui';

type CreateComponentFamilyStateArgs<ValueType> = {
  key: string;
  defaultValue: ValueType;
  componentInstanceContext: ComponentInstanceStateContext<any> | null;
  effects?: AtomEffect<ValueType>[];
};

export const createComponentFamilyStateV2 = <
  ValueType,
  FamilyKey extends SerializableParam
>({
  key,
  effects,
  defaultValue,
  componentInstanceContext,
}: CreateComponentFamilyStateArgs<ValueType>): ComponentFamilyStateV2<
  ValueType,
  FamilyKey
> => {
  if (isDefined(componentInstanceContext)) {
    globalComponentInstanceContextMap.set(key, componentInstanceContext);
  }

  return {
    type: 'ComponentFamilyState',
    key,
    atomFamily: atomFamily<ValueType, ComponentFamilyStateKeyV2<FamilyKey>>({
      key,
      default: defaultValue,
      effects,
    }),
  } satisfies ComponentFamilyStateV2<ValueType, FamilyKey>;
};
