import { useAvailableScopeIdOrThrow } from '../../recoil-scope/scopes-internal/hooks/useAvailableScopeId';
import { getScopeIdOrUndefinedFromComponentId } from '../../recoil-scope/utils/getScopeIdOrUndefinedFromComponentId';
import { ComponentFamilyState } from '../types/ComponentFamilyState';
import { SerializableParam } from 'recoil';

export const useExtractedComponentFamilyStateV2 = <
  FamilyKey extends SerializableParam,
  Value
>(
  componentFamilyState: ComponentFamilyState<Value, FamilyKey>,
  componentId?: string
) => {
  const componentContext = (window as any).componentContextStateMap?.get(
    componentFamilyState.key
  );

  if (!componentContext) {
    throw new Error(
      `Component context for key "${componentFamilyState.key}" is not defined`
    );
  }

  const internalScopeId = useAvailableScopeIdOrThrow(
    componentContext,
    getScopeIdOrUndefinedFromComponentId(componentId)
  );

  const extractedComponentFamilyState = (familyKey: FamilyKey) =>
    componentFamilyState.atomFamily({
      scopeId: internalScopeId,
      familyKey,
    });

  return extractedComponentFamilyState;
};
