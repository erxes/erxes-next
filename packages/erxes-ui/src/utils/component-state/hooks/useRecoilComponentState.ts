import { useAvailableComponentInstanceIdOrThrow } from './useAvailableComponentInstanceIdOrThrow';
import { ComponentStateV2 } from '../types/ComponentStateV2';
import { globalComponentInstanceContextMap } from '../utils/globalComponentInstanceContextMap';
import { useRecoilState } from 'recoil';

export const useRecoilComponentStateV2 = <StateType>(
  componentState: ComponentStateV2<StateType>,
  instanceIdFromProps?: string
) => {
  const componentInstanceContext = globalComponentInstanceContextMap.get(
    componentState.key
  );

  if (!componentInstanceContext) {
    throw new Error(
      `Instance context for key "${componentState.key}" is not defined`
    );
  }

  const instanceId = useAvailableComponentInstanceIdOrThrow(
    componentInstanceContext,
    instanceIdFromProps
  );

  return useRecoilState(componentState.atomFamily({ instanceId }));
};
