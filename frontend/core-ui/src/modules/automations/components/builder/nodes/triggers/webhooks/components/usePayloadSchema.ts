// schema-builder/hooks/usePayloadSchema.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PropertySchema } from '@/automations/components/builder/nodes/triggers/webhooks/states/automationIncomingWebhookFormDefinition';
import {
  createNewRootProperty,
  generateSchemaPreview,
  removeNestedProperty,
  updateNestedProperty,
} from '@/automations/components/builder/nodes/triggers/webhooks/components/utils';

export function normalizePropertyType(
  prop: PropertySchema,
  nextType: PropertySchema['type'],
): PropertySchema {
  if (nextType === 'object') {
    return {
      ...prop,
      type: 'object',
      children: [],
      arrayItemType: undefined,
      arrayItemSchema: undefined,
    };
  }
  if (nextType === 'array') {
    return {
      ...prop,
      type: 'array',
      arrayItemType: 'string',
      arrayItemSchema: undefined,
      children: [],
    };
  }
  return {
    ...prop,
    type: nextType,
    children: [],
    arrayItemType: undefined,
    arrayItemSchema: undefined,
  };
}

export function usePayloadSchema(
  value: PropertySchema[] | undefined,
  onChange: (next: PropertySchema[]) => void,
) {
  const [properties, setProperties] = useState<PropertySchema[]>(value ?? []);
  const lastValueRef = useRef(value);

  useEffect(() => {
    if (lastValueRef.current !== value) {
      setProperties(value ?? []);
      lastValueRef.current = value;
    }
  }, [value]);

  const applyChange = useCallback(
    (updater: (prev: PropertySchema[]) => PropertySchema[]) => {
      setProperties((prev) => {
        const next = updater(prev);
        onChange(next);
        return next;
      });
    },
    [onChange],
  );

  const addProperty = useCallback(
    (parentId?: string) => {
      const newProp = createNewRootProperty();
      applyChange((prev) =>
        parentId
          ? updateNestedProperty(prev, parentId, (p) => ({
              ...p,
              children: [...(p.children ?? []), newProp],
            }))
          : [...prev, newProp],
      );
    },
    [applyChange],
  );

  const removeProperty = useCallback(
    (propertyId: string) => {
      applyChange((prev) => removeNestedProperty(prev, propertyId));
    },
    [applyChange],
  );

  const updateProperty = useCallback(
    (propertyId: string, field: keyof PropertySchema, newValue: unknown) => {
      applyChange((prev) =>
        updateNestedProperty(prev, propertyId, (prop) => {
          if (field === 'type')
            return normalizePropertyType(
              prop,
              newValue as PropertySchema['type'],
            );
          return { ...prop, [field]: newValue } as PropertySchema;
        }),
      );
    },
    [applyChange],
  );

  const toggleExpanded = useCallback(
    (propertyId: string) => {
      applyChange((prev) =>
        updateNestedProperty(prev, propertyId, (prop) => ({
          ...prop,
          isExpanded: !prop.isExpanded,
        })),
      );
    },
    [applyChange],
  );

  const previewJson = useMemo(
    () => JSON.stringify(generateSchemaPreview(properties), null, 2),
    [properties],
  );

  return {
    properties,
    addProperty,
    removeProperty,
    updateProperty,
    toggleExpanded,
    previewJson,
  } as const;
}
