import { IconDatabase, IconPlus, IconShield } from '@tabler/icons-react';
import { Button, Label } from 'erxes-ui';
import { PropertyEditor } from '@/automations/components/builder/nodes/triggers/webhooks/components/PropertyEditor';
import { usePayloadSchema } from '@/automations/components/builder/nodes/triggers/webhooks/components/usePayloadSchema';
import {
  PayloadSchemaGeneratorProps,
  PropertySchema,
} from '@/automations/components/builder/nodes/triggers/webhooks/components/types';
import { generateSchemaPreview } from '@/automations/components/builder/nodes/triggers/webhooks/components/utils';

export const IncomingWebhookPayloadSchemaGenerator = ({
  value,
  onChange,
}: PayloadSchemaGeneratorProps) => {
  const {
    properties: requiredProperties,
    addProperty,
    removeProperty,
    updateProperty,
    toggleExpanded,
    previewJson,
  } = usePayloadSchema(value, onChange);
  const hasProperties = (requiredProperties as PropertySchema[]).length > 0;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium">Payload Schema Validation</h3>
        <p className="text-sm">Define required properties and data types.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Required Properties</h4>
            <Button variant="outline" size="sm" onClick={() => addProperty()}>
              <IconPlus className="mr-1" />
              Add Root Property
            </Button>
          </div>

          {!hasProperties && (
            <div className="text-center py-10">
              <IconDatabase className="mx-auto mb-2" />
              <p className="text-sm">No properties defined.</p>
            </div>
          )}

          <div className="space-y-4">
            {requiredProperties.map((property) => (
              <PropertyEditor
                key={property.id}
                property={property}
                onUpdate={updateProperty}
                onRemove={removeProperty}
                onAddChild={addProperty}
                onToggleExpanded={toggleExpanded}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2 p-4 border rounded-lg md:sticky md:top-4 h-fit">
          <div className="flex items-start gap-2">
            <IconShield className="h-4 w-4 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Expected Payload Structure</p>
              <p className="text-xs">Updates in real-time as you edit.</p>
            </div>
          </div>
          <div className="p-3 rounded text-xs font-mono overflow-x-auto max-h-80 overflow-y-auto border bg-white">
            <pre>{previewJson}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

IncomingWebhookPayloadSchemaGenerator.displayName =
  'IncomingWebhookPayloadSchemaGenerator';
