import { zodResolver } from '@hookform/resolvers/zod';
import { IconChevronLeft } from '@tabler/icons-react';
import { Button, cn, Form, Label } from 'erxes-ui';
import { useState } from 'react';
import { useForm, UseFormSetValue } from 'react-hook-form';
import { DirectMessageConfigForm } from '../components/DirectMessageConfigForm';
import { FacebookBotPersistenceMenuSelector } from '../components/FacebookBotPersistenceMenuSelector';
import { MessageTriggerConditionsList } from '../components/MessageTriggerConditionsList';
import { useFacebookMessengerTrigger } from '../hooks/useFacebookMessengerTrigger';
import {
  TMessageTriggerForm,
  TMessageTriggerFormDirectMessage,
  TMessageTriggerFormPersistentMenu,
  triggerFormSchema,
} from '../states/messageTriggerFormSchema';
import { FacebookBotSelector } from '../../MessengerBotSelector';

const renderActiveItemContent = ({
  onConditionChange,
  activeItemType,
  setActiveItemType,
  formState,
}: {
  onConditionChange: (
    conditionType: string,
    fieldName: 'persistentMenuIds' | 'conditions' | 'isSelected',
    fieldValue:
      | TMessageTriggerFormDirectMessage
      | TMessageTriggerFormPersistentMenu
      | boolean,
  ) => void;
  activeItemType: string;
  setActiveItemType: React.Dispatch<React.SetStateAction<string>>;
  formState: TMessageTriggerForm;
  setFormValue: UseFormSetValue<TMessageTriggerForm>;
}) => {
  const onConditionItemChange = (
    fieldName: 'persistentMenuIds' | 'conditions',
    fieldValue:
      | TMessageTriggerFormDirectMessage
      | TMessageTriggerFormPersistentMenu,
  ) => {
    onConditionChange(activeItemType, fieldName, fieldValue);
  };

  return (
    <div className="border border-md m-4 py-2 px-4">
      <Button variant="ghost" onClick={() => setActiveItemType('')}>
        <IconChevronLeft />
        Back to conditions
      </Button>
      {(() => {
        switch (activeItemType) {
          case 'direct':
            return (
              <DirectMessageConfigForm
                conditions={
                  formState.conditions?.find(({ type }) => type === 'direct')
                    ?.conditions || []
                }
                botId={formState.botId}
                onConditionChange={onConditionItemChange}
              />
            );
          case 'persistentMenu':
            return (
              <FacebookBotPersistenceMenuSelector
                botId={formState.botId}
                selectedPersistentMenuIds={formState.persistentMenuIds}
                onConditionChange={onConditionItemChange}
              />
            );
          default:
            return null;
        }
      })()}
    </div>
  );
};

const renderConditionsContent = ({
  conditions,
  loading,
  activeItemType,
  setActiveItemType,
  formState,
  setFormValue,
}: {
  conditions: any[];
  loading: boolean;
  activeItemType: string;
  setActiveItemType: React.Dispatch<React.SetStateAction<string>>;
  formState: TMessageTriggerForm;
  setFormValue: UseFormSetValue<TMessageTriggerForm>;
}) => {
  const onConditionChange = (
    conditionType: string,
    fieldName: 'persistentMenuIds' | 'conditions' | 'isSelected',
    fieldValue:
      | TMessageTriggerFormDirectMessage
      | TMessageTriggerFormPersistentMenu
      | boolean,
  ) => {
    const condition = (formState?.conditions || []).find(
      ({ type }) => type === conditionType,
    );

    if (!condition) {
      setFormValue('conditions', [
        ...(formState?.conditions || []),
        {
          _id: Math.random().toString(),
          type: conditionType,
          [fieldName]: fieldValue,
        },
      ]);
    } else {
      setFormValue('conditions', [
        ...(formState?.conditions || []).map((cond) =>
          cond.type === conditionType
            ? { ...cond, [fieldName]: fieldValue }
            : cond,
        ),
      ]);
    }
  };

  if (activeItemType) {
    return renderActiveItemContent({
      onConditionChange,
      activeItemType,
      setActiveItemType,
      formState,
      setFormValue,
    });
  }

  const onItemCheck = (type: string, isChecked: boolean) => {
    onConditionChange(type, 'isSelected', isChecked);
  };

  return (
    <MessageTriggerConditionsList
      conditions={conditions}
      loading={loading}
      setActiveItemType={setActiveItemType}
      onItemCheck={onItemCheck}
    />
  );
};

export const MessageTriggerForm = ({
  activeTrigger,
  onSaveTriggerConfig,
}: any) => {
  const form = useForm<TMessageTriggerForm>({
    resolver: zodResolver(triggerFormSchema),
    values: { ...(activeTrigger?.config || {}) },
  });
  const { watch, setValue } = form;
  const formState = watch();
  const [activeItemType, setActiveItemType] = useState('');
  const { conditions, loading } = useFacebookMessengerTrigger();

  return (
    <Form {...form}>
      <div className="flex flex-col h-full">
        <Form.Field
          control={form.control}
          name="botId"
          render={({ field }) => (
            <FacebookBotSelector
              botId={field.value}
              onSelect={field.onChange}
            />
          )}
        />

        <Label>Triggers</Label>
        <div
          className={cn('flex-1 flex flex-col relative', {
            blur: !formState.botId,
          })}
        >
          <div className="flex-1 overflow-auto">
            {renderConditionsContent({
              conditions,
              loading,
              activeItemType,
              setActiveItemType,
              formState,
              setFormValue: setValue,
            })}
          </div>

          <div className="p-2 flex justify-end border-t bg-white">
            <Button onClick={() => onSaveTriggerConfig(formState)}>Save</Button>
          </div>
        </div>
      </div>
    </Form>
  );
};
