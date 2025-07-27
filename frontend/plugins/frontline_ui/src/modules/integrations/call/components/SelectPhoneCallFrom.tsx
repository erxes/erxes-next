import { useCallUserIntegration } from '@/integrations/call/hooks/useCallUserIntegration';
import { callConfigAtom } from '@/integrations/call/states/sipStates';
import { Label, Select, formatPhoneNumber } from 'erxes-ui';
import { useAtomValue } from 'jotai';

export const SelectPhoneCallFrom = () => {
  const { callUserIntegrations } = useCallUserIntegration();
  const callConfig = useAtomValue(callConfigAtom);

  return (
    <div className="space-y-2">
      <Label htmlFor="call-from">Call from</Label>
      <Select>
        <Select.Trigger id="call-from">
          <Select.Value placeholder="Select a phone" />
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Label>Phone</Select.Label>
            {callUserIntegrations?.map((integration) => (
              <Select.Item key={integration._id} value={integration.phone}>
                {formatPhoneNumber({
                  value: integration.phone,
                  defaultCountry: 'MN',
                })}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select>
    </div>
  );
};
