import { automationBuilderActiveTabState } from '@/automations/states/automationState';
import { TAutomationBuilderForm } from '@/automations/utils/automationFormDefinitions';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { Badge, Button, Command, Form, Label, Switch } from 'erxes-ui';
import { useAtomValue } from 'jotai';
import { useFormContext } from 'react-hook-form';

export const AutomationBuilderHeaderActions = () => {
  const { control } = useFormContext<TAutomationBuilderForm>();
  const activeTab = useAtomValue(automationBuilderActiveTabState);

  if (activeTab !== 'builder') {
    return null;
  }

  return (
    <div className="flex flex-row justify-between items-center gap-4">
      <Form.Field
        control={control}
        name="status"
        render={({ field }) => (
          <Form.Item>
            <Form.Control>
              <div className="flex items-center space-x-2">
                <Label htmlFor="mode">Inactive</Label>
                <Switch
                  id="mode"
                  onCheckedChange={(open) =>
                    field.onChange(open ? 'active' : 'draft')
                  }
                  checked={field.value === 'active'}
                />
              </div>
            </Form.Control>
          </Form.Item>
        )}
      />
    </div>
  );
};

const ToggleButton = ({
  isOpen,
  onToggle,
  openLabel,
  closedLabel,
  shortcut,
}: {
  isOpen: boolean;
  onToggle: () => void;
  openLabel: React.ReactNode;
  closedLabel: React.ReactNode;
  shortcut: string;
}) => {
  return (
    <Button variant="ghost" onClick={onToggle}>
      {isOpen ? (
        <>
          <IconEyeOff />
          {openLabel}
        </>
      ) : (
        <>
          <IconEye />
          {closedLabel}
        </>
      )}
      <Badge variant="secondary">
        <Command.Shortcut>{shortcut}</Command.Shortcut>
      </Badge>
    </Button>
  );
};
