import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { generateAutomationElementId } from 'ui-modules';
import {
  generateSchemaPreview,
  removeNestedProperty,
  updateNestedProperty,
} from '@/automations/components/builder/nodes/triggers/webhooks/components/utils';
import { PropertySchema } from '@/automations/components/builder/nodes/triggers/webhooks/components/types';

export function usePayloadSchema(
  value: PropertySchema[] | undefined,
  onChange: (next: PropertySchema[]) => void,
) {
  const [properties, setProperties] = useState<PropertySchema[]>(value || []);
  const lastValueRef = useRef<PropertySchema[] | undefined>(value);

  // Sync down when external value reference changes (e.g., form reset)
  useEffect(() => {
    if (lastValueRef.current !== value) {
      setProperties(value || []);
      lastValueRef.current = value;
    }
  }, [value]);

  const addProperty = useCallback(
    (parentId?: string) => {
      const newProperty: PropertySchema = {
        id: generateAutomationElementId(),
        name: '',
        type: 'string',
        required: true,
        description: '',
        isExpanded: true,
      };

      if (parentId) {
        const next = updateNestedProperty(properties, parentId, (parent) => ({
          ...parent,
          children: [...(parent.children || []), newProperty],
        }));
        setProperties(next);
        onChange(next);
        return;
      }
      const next = [...properties, newProperty];
      setProperties(next);
      onChange(next);
    },
    [onChange, properties],
  );

  const removeProperty = useCallback(
    (propertyId: string) => {
      const next = removeNestedProperty(properties, propertyId);
      setProperties(next);
      onChange(next);
    },
    [onChange, properties],
  );

  const updateProperty = useCallback(
    (propertyId: string, field: string, value: unknown) => {
      const next = updateNestedProperty(properties, propertyId, (prop) => {
        // Normalize based on field and type transitions
        if (field === 'type') {
          const nextType = value as PropertySchema['type'];
          if (nextType === 'object') {
            return {
              ...prop,
              type: 'object',
              children: prop.children || [],
              arrayItemType: undefined,
              arrayItemSchema: [],
            };
          }
          if (nextType === 'array') {
            // default array item type to string if not set
            const nextArrayItemType = prop.arrayItemType || 'string';
            return {
              ...prop,
              type: 'array',
              arrayItemType: nextArrayItemType,
              arrayItemSchema:
                nextArrayItemType === 'object'
                  ? prop.arrayItemSchema || []
                  : [],
              children: [],
            };
          }
          // primitive switch
          return {
            ...prop,
            type: nextType,
            children: [],
            arrayItemType: undefined,
            arrayItemSchema: [],
          };
        }

        if (field === 'arrayItemType') {
          const nextArrayItemType = value as NonNullable<
            PropertySchema['arrayItemType']
          >;
          return {
            ...prop,
            arrayItemType: nextArrayItemType,
            arrayItemSchema:
              nextArrayItemType === 'object' ? prop.arrayItemSchema || [] : [],
          };
        }

        if (field === 'arrayItemSchema') {
          return {
            ...prop,
            arrayItemSchema: (value as PropertySchema[]) || [],
          };
        }

        if (field === 'children') {
          return {
            ...prop,
            children: (value as PropertySchema[]) || [],
          };
        }

        return {
          ...prop,
          [field]: value as never,
        };
      });
      setProperties(next);
      onChange(next);
    },
    [onChange, properties],
  );

  const toggleExpanded = useCallback(
    (propertyId: string) => {
      const next = updateNestedProperty(properties, propertyId, (prop) => ({
        ...prop,
        isExpanded: !prop.isExpanded,
      }));
      setProperties(next);
      onChange(next);
    },
    [onChange, properties],
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
