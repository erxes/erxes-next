import { IconTrash } from '@tabler/icons-react';
import { Button, Card, Form, Label, Select } from 'erxes-ui/components';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FieldWithError,
  getFieldsProperties,
  IActionProps,
  PlaceHolderInput,
  IField as UIModuleField,
  groupFieldsByType,
} from 'ui-modules';
import { PROPERTY_OPERATOR } from '~/modules/constants';
import { TAutomationProps } from '../common/formSchema';
import { getContentType } from '../common/utils';

type OperatorType = 'String' | 'Date' | 'Number' | 'Default';

// Types
interface IField extends Partial<UIModuleField> {
  group?: string;
  groupDetail?: {
    name: string;
  };
}

interface IOperator {
  value: string;
  label: string;
  noInput?: boolean;
}

interface IRule {
  field: string;
  operator: string;
  value?: any;
}

interface IConfig {
  module?: string;
  rules: IRule[];
}

type IFieldName = `detail.actions.${number}.config`;

// Component Props
interface RuleInputProps {
  propertyType: string;

  selectedOperator?: IOperator;
  selectedField?: IField;
  value: any;
  onChange: (value: any) => void;
}

interface RuleProps {
  rule: IRule;
  propertyType: string;
  selectedField?: IField;
  remove: () => void;
  handleChange: (name: string, value: any) => void;
  groups: Record<string, IField[]>;
  operatorOptions: IOperator[];
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const Rule = ({
  rule,
  remove,
  handleChange,
  groups,
  selectedField,
  operatorOptions,
  propertyType,
}: RuleProps) => {
  return (
    <div className="border rounded p-4  mb-2 relative group">
      <div className="flex flex-row gap-4 mb-4  items-end">
        <Form.Item className="w-3/5">
          <Form.Label>Field</Form.Label>

          <Select
            value={rule.field}
            onValueChange={(value) => handleChange('field', value)}
          >
            <Select.Trigger>
              <Select.Value placeholder="Select an field" />
            </Select.Trigger>
            <Select.Content>
              {Object.entries(groups).map(([key, fields], index) => {
                const groupName =
                  fields.find(({ group }) => group === key)?.groupDetail
                    ?.name || key;

                return (
                  <div key={index}>
                    <Select.Group>
                      <Select.Label>{groupName}</Select.Label>
                      {fields.map(({ _id, name, label }) => (
                        <Select.Item key={_id} value={name || ''}>
                          {label}
                        </Select.Item>
                      ))}
                    </Select.Group>
                    <Select.Separator />
                  </div>
                );
              })}
            </Select.Content>
          </Select>
        </Form.Item>

        <Form.Item className="w-2/5 ">
          <Form.Label>Operator</Form.Label>

          <Select
            value={rule.operator}
            onValueChange={(value) => handleChange('operator', value)}
          >
            <Select.Trigger>
              <Select.Value placeholder="Select an operator" />
            </Select.Trigger>
            <Select.Content>
              {operatorOptions.map(({ value, label }) => (
                <Select.Item key={value} value={value}>
                  {label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </Form.Item>
        <Button
          variant="destructive"
          size="icon"
          className="flex-shrink-0 opacity-0 absolute -top-6 right-1 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out"
          onClick={remove}
        >
          <IconTrash size={16} />
        </Button>
      </div>
      <div className="mb-4">
        <Form.Item>
          <Form.Label>Value</Form.Label>

          <PlaceHolderInput
            propertyType={propertyType}
            selectedOperator={operatorOptions.find(
              (op) => op.value === rule.operator,
            )}
            selectedField={selectedField}
            value={rule.value}
            onChange={(value) => handleChange('value', value)}
          />
        </Form.Item>
      </div>
    </div>
  );
};

export const ManageProperties = ({
  currentActionIndex,
  currentAction,
  handleSave,
}: IActionProps) => {
  const fieldName: IFieldName = `detail.actions.${currentActionIndex}.config`;
  const { setValue, watch, control } = useFormContext<TAutomationProps>();
  const { actions = [], triggers = [] } = watch('detail');
  const module = watch(`${fieldName}.module`);
  const propertyType =
    module || getContentType(currentAction, actions, triggers);

  useEffect(() => {
    if (module !== propertyType) {
      setValue(`${fieldName}.module`, propertyType);
    }
  }, [propertyType]);
  const { propertyTypes, fields } = getFieldsProperties(propertyType);

  const groups = groupFieldsByType(fields);
  const config = watch(fieldName) as IConfig;
  const { rules = [{ field: '', operator: '' }] } = config || {};

  const addRule = () => {
    setValue(fieldName, {
      ...config,
      rules: [...rules, { field: '', operator: '' }],
    });
  };

  return (
    <Card.Content className="w-[500px]">
      <Form.Field
        control={control}
        name={`${fieldName}.module`}
        render={({ field }) => (
          <FieldWithError>
            <Form.Item>
              <Form.Label>Property Type</Form.Label>
              <Form.Control>
                <Select
                  value={field.value || propertyType}
                  onValueChange={field.onChange}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select a property type" />
                  </Select.Trigger>
                  <Select.Content>
                    {propertyTypes.map(({ value, description }) => (
                      <Select.Item key={value} value={value}>
                        {description}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </Form.Control>
            </Form.Item>
          </FieldWithError>
        )}
      />

      <div className="py-4">
        <Label className="pb-4">Rules</Label>

        {rules.map((rule, index) => {
          const handleChange = (name: string, value: any) => {
            const updatedRules = [...rules];
            updatedRules[index] = { ...updatedRules[index], [name]: value };
            setValue(`${fieldName}.rules` as any, updatedRules);
          };

          const selectedField = fields.find(
            (field) => field.name === rule.field,
          );

          const handleRemove = () => {
            setValue(
              `${fieldName}.rules` as any,
              rules.filter((_, ruleIndex) => index !== ruleIndex),
            );
          };

          const operatorType = selectedField?.name.includes('customFieldsData')
            ? capitalizeFirstLetter(selectedField?.validation || 'String')
            : selectedField?.type || '';

          const operators =
            PROPERTY_OPERATOR[operatorType as OperatorType] ||
            PROPERTY_OPERATOR.Default;

          return (
            <Rule
              key={index}
              rule={rule}
              handleChange={handleChange}
              remove={handleRemove}
              groups={groups}
              propertyType={propertyType}
              selectedField={selectedField}
              operatorOptions={operators}
            />
          );
        })}

        <Button className="w-full" variant="secondary" onClick={addRule}>
          <Label>Add Rule</Label>
        </Button>
      </div>
    </Card.Content>
  );
};

export const NodeContent = ({ config }: any) => {
  const { module, rules = [] } = config || {};
  return (
    <>
      <div className="flex text-slate-600 text-xs ">
        <span className="font-mono">Content Type: </span>
        <span className="font-mono capitalize">{`${
          (module || '').split(':')[1]
        }`}</span>
      </div>
      {rules
        .filter(({ field, value }: any) => field && value)
        .map(({ field, value }: any, index: number) => (
          <div
            key={index}
            className="flex justify-between text-slate-600 text-xs w-max"
          >
            <span className="font-mono">{field}:</span>
            <span className="font-mono">{value}</span>
          </div>
        ))}
    </>
  );
};
