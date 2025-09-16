import { PropertySchema } from '@/automations/components/builder/nodes/triggers/webhooks/components/types';

export function updateNestedProperty(
  properties: PropertySchema[],
  targetId: string,
  updater: (prop: PropertySchema) => PropertySchema,
): PropertySchema[] {
  return properties.map((prop) => {
    if (prop.id === targetId) return updater(prop);

    if (prop.children) {
      return {
        ...prop,
        children: updateNestedProperty(prop.children, targetId, updater),
      };
    }

    if (prop.arrayItemSchema) {
      return {
        ...prop,
        arrayItemSchema: updateNestedProperty(
          prop.arrayItemSchema,
          targetId,
          updater,
        ),
      };
    }

    return prop;
  });
}

export function removeNestedProperty(
  properties: PropertySchema[],
  targetId: string,
): PropertySchema[] {
  return properties.filter((prop) => {
    if (prop.id === targetId) return false;

    if (prop.children) {
      prop.children = removeNestedProperty(prop.children, targetId);
    }

    if (prop.arrayItemSchema) {
      prop.arrayItemSchema = removeNestedProperty(
        prop.arrayItemSchema,
        targetId,
      );
    }

    return true;
  });
}

export function generateSchemaPreview(properties: PropertySchema[]): unknown {
  const result: Record<string, unknown> = {};

  properties.forEach((prop) => {
    if (!prop.name) return;

    switch (prop.type) {
      case 'string':
        result[prop.name] = 'string_value';
        break;
      case 'number':
        result[prop.name] = 123;
        break;
      case 'boolean':
        result[prop.name] = true;
        break;
      case 'object':
        result[prop.name] = prop.children
          ? generateSchemaPreview(prop.children)
          : {};
        break;
      case 'array':
        if (prop.arrayItemType === 'object' && prop.arrayItemSchema) {
          result[prop.name] = [
            generateSchemaPreview(prop.arrayItemSchema) as Record<
              string,
              unknown
            >,
          ];
        } else {
          const sampleValue =
            prop.arrayItemType === 'string'
              ? 'string_value'
              : prop.arrayItemType === 'number'
              ? 123
              : prop.arrayItemType === 'boolean'
              ? true
              : 'mixed_value';
          result[prop.name] = [sampleValue];
        }
        break;
    }
  });

  return result;
}
