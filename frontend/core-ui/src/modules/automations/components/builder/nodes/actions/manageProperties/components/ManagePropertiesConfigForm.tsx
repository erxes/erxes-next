import { ManagePropertyRuleProps } from '@/automations/types/manageProperties';
import { IconTrash } from '@tabler/icons-react';
import { Button, Form, Label, Select } from 'erxes-ui';
import { useEffect } from 'react';
import { TAutomationActionProps, PlaceHolderInput } from 'ui-modules';
import { useManagePropertyRule } from '../hooks/useManagePropertyRule';
import { useManagePropertySidebarContent } from '../hooks/useManagePropertySidebarContent';

export const ManagePropertiesConfigForm = ({
  currentActionIndex,
  currentAction,
}: TAutomationActionProps) => {
  const {
    setValue,
    propertyTypes,
    propertyType,
    fieldName,
    control,
    addRule,
    rules,
    module,
  } = useManagePropertySidebarContent(currentActionIndex, currentAction);

  useEffect(() => {
    if (module && module !== propertyType) {
      setValue(`${fieldName}.module`, propertyType);
    }
  }, [module, propertyType]);

  return (
    <div className="w-[500px] p-4">
      <Form.Field
        control={control}
        name={`${fieldName}.module`}
        render={({ field }) => (
          <Form.Item>
            <Label>Property Type</Label>
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
          </Form.Item>
        )}
      />

      <div className="py-4">
        <Label className="pb-4">Rules</Label>

        {rules.map((rule, index) => {
          const updatedProps = {
            rules,
            rule,
            index,
            propertyType,
            fieldName,
          };

          return <Rule key={index} {...updatedProps} />;
        })}

        <Button className="w-full" variant="secondary" onClick={addRule}>
          <Label>Add Rule</Label>
        </Button>
      </div>
    </div>
  );
};

const Rule = ({
  rules,
  rule,

  propertyType,
  fieldName,
  index,
}: ManagePropertyRuleProps) => {
  const {
    handleChange,
    handleRemove,
    selectedField,
    operators,
    groups,
    fields,
  } = useManagePropertyRule({ rules, index, fieldName, rule, propertyType });

  return (
    <div className="border rounded p-4  mb-2 relative group">
      <div className="flex flex-row gap-4 mb-4  items-end">
        <div className="w-3/5">
          <Label>Field</Label>

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
        </div>

        <div className="w-2/5 ">
          <Label>Operator</Label>

          <Select
            value={rule.operator}
            onValueChange={(value) => handleChange('operator', value)}
          >
            <Select.Trigger>
              <Select.Value placeholder="Select an operator" />
            </Select.Trigger>
            <Select.Content>
              {operators.map(({ value, label }) => (
                <Select.Item key={value} value={value}>
                  {label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
        <Button
          variant="destructive"
          size="icon"
          className="flex-shrink-0 opacity-0 absolute -top-6 right-1 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out"
          onClick={handleRemove}
        >
          <IconTrash size={16} />
        </Button>
      </div>
      <div className="mb-4">
        <div>
          <Label>Value</Label>

          <PlaceHolderInput
            propertyType={propertyType}
            isDisabled={operators.some((op) => op.value === rule.operator)}
            fieldType={selectedField?.type}
            value={rule.value}
            onChange={(value) => handleChange('value', value)}
          />
        </div>
      </div>
    </div>
  );
};
