import { ComponentInstanceStateContext } from '../types/ComponentInstanceStateContext';
import { ComponentStateKeyV2 } from '../types/ComponentStateKeyV2';
import { createContext } from 'react';

export const createComponentInstanceContext = <
  T extends ComponentStateKeyV2 = ComponentStateKeyV2
>(
  initialValue?: T
) => {
  return createContext<T | null>(
    initialValue ?? null
  ) as ComponentInstanceStateContext<T>;
};
