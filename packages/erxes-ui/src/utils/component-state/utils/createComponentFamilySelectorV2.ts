import { selectorFamily, SerializableParam } from 'recoil';

import { ComponentFamilyReadOnlySelectorV2 } from '../types/ComponentFamilyReadOnlySelectorV2';
import { ComponentFamilySelectorV2 } from '../types/ComponentFamilySelectorV2';
import { ComponentFamilyStateKeyV2 } from '../types/ComponentFamilyStateKeyV2';
import { ComponentInstanceStateContext } from '../types/ComponentInstanceStateContext';
import { globalComponentInstanceContextMap } from './globalComponentInstanceContextMap';
import { SelectorGetter } from '@/ui/utilities/state/types/SelectorGetter';
import { SelectorSetter } from '@/ui/utilities/state/types/SelectorSetter';
import { isDefined } from 'twenty-ui';

export const createComponentFamilySelectorV2 = <
  ValueType,
  FamilyKey extends SerializableParam
>({
  key,
  get,
  set,
  componentInstanceContext,
}: {
  key: string;
  get: SelectorGetter<ValueType, ComponentFamilyStateKeyV2<FamilyKey>>;
  set?: SelectorSetter<ValueType, ComponentFamilyStateKeyV2<FamilyKey>>;
  componentInstanceContext: ComponentInstanceStateContext<any> | null;
}):
  | ComponentFamilySelectorV2<ValueType, FamilyKey>
  | ComponentFamilyReadOnlySelectorV2<ValueType, FamilyKey> => {
  if (isDefined(componentInstanceContext)) {
    globalComponentInstanceContextMap.set(key, componentInstanceContext);
  }

  if (isDefined(set)) {
    return {
      type: 'ComponentFamilySelector',
      key,
      selectorFamily: selectorFamily<
        ValueType,
        ComponentFamilyStateKeyV2<FamilyKey>
      >({
        key,
        get,
        set,
      }),
    } satisfies ComponentFamilySelectorV2<ValueType, FamilyKey>;
  } else {
    return {
      type: 'ComponentFamilyReadOnlySelector',
      key,
      selectorFamily: selectorFamily<
        ValueType,
        ComponentFamilyStateKeyV2<FamilyKey>
      >({
        key,
        get,
      }),
    } satisfies ComponentFamilyReadOnlySelectorV2<ValueType, FamilyKey>;
  }
};
