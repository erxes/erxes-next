import { useAutomation } from '@/automations/context/AutomationProvider';
import {
  automationBuilderActiveTabState,
  automationBuilderPanelOpenState,
  automationBuilderSiderbarOpenState,
  toggleAutomationBuilderOpenPanel,
  toggleAutomationBuilderOpenSidebar,
} from '@/automations/states/automationState';
import { TAutomationBuilderForm } from '@/automations/utils/AutomationFormDefinitions';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { Badge, Button, Command, Form, Label, Switch } from 'erxes-ui';
import { useAtomValue, useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

export const AutomationBuilderHeaderActions = () => {
  const { control } = useFormContext<TAutomationBuilderForm>();
  const isOpenSideBar = useAtomValue(automationBuilderSiderbarOpenState);
  const toggleSideBarOpen = useSetAtom(toggleAutomationBuilderOpenSidebar);

  const isPanelOpen = useAtomValue(automationBuilderPanelOpenState);
  const togglePanelOpen = useSetAtom(toggleAutomationBuilderOpenPanel);
  const activeTab = useAtomValue(automationBuilderActiveTabState);
  const isMac = useMemo(
    () => /Mac|iPod|iPhone|iPad/.test(navigator.platform),
    [],
  );

  if (activeTab !== 'builder') {
    return null;
  }

  return (
    <div className="flex flex-row justify-between items-center gap-4">
      {/* <ToggleButton
        isOpen={isPanelOpen}
        onToggle={togglePanelOpen}
        openLabel="Hide Inspect"
        closedLabel="Show Inspect"
        shortcut={`${isMac ? '⌘' : 'Ctrl'}I`}
      />

      <ToggleButton
        isOpen={isOpenSideBar}
        onToggle={toggleSideBarOpen}
        openLabel="Hide Menu"
        closedLabel="Show Menu"
        shortcut={`${isMac ? '⌘' : 'Ctrl'}G`}
      /> */}

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
