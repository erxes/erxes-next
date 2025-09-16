export interface PropertySchema {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description?: string;
  children?: PropertySchema[];
  arrayItemType?: 'string' | 'number' | 'boolean' | 'object';
  arrayItemSchema?: PropertySchema[];
  isExpanded?: boolean;
}

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
