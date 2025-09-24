import { ManagePropertyRuleProps } from '@/automations/types/manageProperties';
import { IconTrash } from '@tabler/icons-react';
import { Button, Form, Label, Select } from 'erxes-ui';
import { useEffect } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AutomationCoreConfigFormWrapper } from '@/automations/components/builder/nodes/components/AutomationConfigFormWrapper';
import { useFormValidationErrorHandler } from '@/automations/hooks/useFormValidationErrorHandler';
import { TAutomationActionProps, PlaceHolderInput } from 'ui-modules';
import { useManagePropertySidebarContent } from '../hooks/useManagePropertySidebarContent';
import {
  managePropertiesFormSchema,
  TManagePropertiesForm,
} from '@/automations/components/builder/nodes/actions/manageProperties/states/managePropertiesForm';

export const ManagePropertiesConfigForm = ({
  currentAction,
  handleSave,
  currentActionIndex,
}: TAutomationActionProps<TManagePropertiesForm>) => {
  const { handleValidationErrors } = useFormValidationErrorHandler({
    formName: 'Manage properties Configuration',
  });

  const form = useForm<TManagePropertiesForm>({
    resolver: zodResolver(managePropertiesFormSchema),
    defaultValues: { ...(currentAction?.config || {}) },
  });

  const { propertyTypes, propertyType } = useManagePropertySidebarContent(
    currentActionIndex,
    currentAction,
  );

  const { control, setValue, handleSubmit } = form;
  const { rules = [], module } = useWatch<TManagePropertiesForm>({ control });

  const normalizedRules: { field: string; operator: string; value?: any }[] = (
    (rules as TManagePropertiesForm['rules']) || []
  ).map((r) => ({
    field: r?.field ?? '',
    operator: r?.operator ?? '',
    value: r?.value,
  }));

  useEffect(() => {
    if (module && module !== propertyType) {
      setValue('module', propertyType);
    }
  }, [module, propertyType, setValue]);

  return (
    <FormProvider {...form}>
      <AutomationCoreConfigFormWrapper
        onSave={handleSubmit(handleSave, handleValidationErrors)}
      >
        <div className="w-[500px] p-4">
          <Form.Field
            control={control}
            name={`module`}
            defaultValue={propertyTypes[0]?.value}
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Property Type</Form.Label>
                <Select value={field.value} onValueChange={field.onChange}>
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

            {normalizedRules.map((rule, index) => (
              <Rule
                key={index}
                rules={normalizedRules}
                rule={rule}
                index={index}
                propertyType={propertyType}
              />
            ))}

            <Button
              className="w-full"
              variant="secondary"
              onClick={() =>
                setValue(
                  'rules',
                  [
                    ...normalizedRules,
                    { field: '', operator: '' },
                  ] as TManagePropertiesForm['rules'],
                  { shouldDirty: true, shouldTouch: true },
                )
              }
            >
              <Label>Add Rule</Label>
            </Button>
          </div>
        </div>
      </AutomationCoreConfigFormWrapper>
    </FormProvider>
  );
};

import { useFormContext } from 'react-hook-form';
import { getFieldsProperties, groupFieldsByType } from 'ui-modules';
import { PROPERTY_OPERATOR } from '@/automations/constants';

type LocalRuleProps = {
  rules: { field: string; operator: string; value?: any }[];
  rule: { field: string; operator: string; value?: any };
  index: number;
  propertyType: string;
};

const Rule = ({ rules, rule, propertyType, index }: LocalRuleProps) => {
  const { setValue } = useFormContext<TManagePropertiesForm>();
  const { fields = [] } = getFieldsProperties(propertyType);
  const groups = groupFieldsByType(fields || []);

  const handleChange = (name: string, value: any) => {
    const updatedRules = [...rules];
    updatedRules[index] = { ...updatedRules[index], [name]: value };
    setValue('rules', updatedRules, { shouldDirty: true, shouldTouch: true });
  };

  const handleRemove = () => {
    setValue(
      'rules',
      rules.filter((_, i) => i !== index),
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const selectedField = fields.find((f) => f.name === rule.field);

  const operatorType = selectedField?.name?.includes('customFieldsData')
    ? (selectedField?.validation as string) || 'String'
    : (selectedField?.type as string) || 'Default';

  const operators =
    PROPERTY_OPERATOR[
      (operatorType as unknown as keyof typeof PROPERTY_OPERATOR) || 'Default'
    ] || PROPERTY_OPERATOR.Default;

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
