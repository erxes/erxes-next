import { ManagePropertyRule } from '@/automations/components/builder/nodes/actions/manageProperties/components/ManagePropertyRule';
import {
  managePropertiesFormSchema,
  TManagePropertiesForm,
} from '@/automations/components/builder/nodes/actions/manageProperties/states/managePropertiesForm';
import { AutomationCoreConfigFormWrapper } from '@/automations/components/builder/nodes/components/AutomationConfigFormWrapper';
import { useFormValidationErrorHandler } from '@/automations/hooks/useFormValidationErrorHandler';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Label, Select } from 'erxes-ui';
import { IconInfoCircle } from '@tabler/icons-react';
import { Alert } from 'erxes-ui';
import { FormProvider, useForm } from 'react-hook-form';
import { TAutomationActionProps } from 'ui-modules';
import { useManagePropertySidebarContent } from '../hooks/useManagePropertySidebarContent';

export const ManagePropertiesConfigForm = ({
  currentAction,
  handleSave,
}: TAutomationActionProps<TManagePropertiesForm>) => {
  const { handleValidationErrors } = useFormValidationErrorHandler({
    formName: 'Manage properties Configuration',
  });

  const form = useForm<TManagePropertiesForm>({
    resolver: zodResolver(managePropertiesFormSchema),
    defaultValues: { ...(currentAction?.config || {}) },
  });
  const { propertyTypes, propertyType, nonCustomTriggers, actionsCanBeTarget } =
    useManagePropertySidebarContent(currentAction, form);

  // Keep module in sync with inferred propertyType if needed
  // if (module && module !== propertyType) setValue('module', propertyType);

  if (!propertyType) {
    return (
      <div className="p-4">
        <Alert variant="default" className="mb-4">
          <IconInfoCircle className="mr-2 inline size-4 text-muted-foreground" />
          <Alert.Title>We couldn’t find a matching context</Alert.Title>
          <Alert.Description>
            This action may not apply to the current workflow. Select a module
            or choose a trigger/action to proceed.
          </Alert.Description>
        </Alert>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <AutomationCoreConfigFormWrapper
        onSave={form.handleSubmit(handleSave, handleValidationErrors)}
      >
        <div className="w-[500px] p-4">
          <Form.Field
            control={form.control}
            name="module"
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
                <Form.Message />
              </Form.Item>
            )}
          />

          {!form.getValues('module') &&
            (nonCustomTriggers?.length ?? 0) > 1 && (
              <Form.Field
                control={form.control}
                name="targetTriggerId"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Select trigger</Form.Label>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <Select.Trigger>
                        <Select.Value placeholder="Select a trigger" />
                      </Select.Trigger>
                      <Select.Content>
                        {nonCustomTriggers.map(({ trigger }) => (
                          <Select.Item key={trigger.id} value={trigger.id}>
                            {trigger.label || trigger.type}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                    <Form.Description>
                      Choose which trigger’s context to use for properties.
                    </Form.Description>
                    <Form.Message />
                  </Form.Item>
                )}
              />
            )}

          {!form.getValues('module') &&
            (actionsCanBeTarget?.length ?? 0) > 1 && (
              <Form.Field
                control={form.control}
                name="targetActionId"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Select action</Form.Label>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <Select.Trigger>
                        <Select.Value placeholder="Select an action" />
                      </Select.Trigger>
                      <Select.Content>
                        {actionsCanBeTarget.map((a) => (
                          <Select.Item key={a.id} value={a.id}>
                            {a.label || a.type}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                    <Form.Description>
                      Optionally choose a targetable action’s context.
                    </Form.Description>
                    <Form.Message />
                  </Form.Item>
                )}
              />
            )}
          <Form.Field
            control={form.control}
            name="rules"
            render={({ field: { value: rules = [], onChange } }) => (
              <Form.Item>
                <Form.Label>Rules</Form.Label>

                {rules.map((rule, index) => (
                  <ManagePropertyRule
                    key={index}
                    rule={rule}
                    index={index}
                    propertyType={propertyType}
                  />
                ))}
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={() =>
                    onChange([...rules, { field: '', operator: '' }], {
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }
                >
                  <Label>Add Rule</Label>
                </Button>
              </Form.Item>
            )}
          />
        </div>
      </AutomationCoreConfigFormWrapper>
    </FormProvider>
  );
};
