import { PropertySchema } from '@/automations/components/builder/nodes/triggers/webhooks/states/automationIncomingWebhookFormDefinition';

export interface PayloadSchemaGeneratorProps {
  value?: PropertySchema[];
  onChange: (next: PropertySchema[]) => void;
}

export interface PropertyEditorProps {
  property: PropertySchema;
  depth?: number;
  onUpdate: (propertyId: string, field: string, value: unknown) => void;
  onRemove: (propertyId: string) => void;
  onAddChild: (parentId: string) => void;
  onToggleExpanded: (propertyId: string) => void;
}
