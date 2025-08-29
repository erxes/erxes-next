import { Button, Select, TextOverflowTooltip, Form } from 'erxes-ui';
import { useGetActiveCycles } from '@/cycle/hooks/useGetActiveCycles';
import { IconCalendarRepeat, IconBan } from '@tabler/icons-react';
import { useState } from 'react';
import { useGetTeam } from '@/team/hooks/useGetTeam';
export const SelectCycle = ({
  teamId,
  value,
  onChange,
}: {
  teamId: string | undefined;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}) => {
  const { team } = useGetTeam({ variables: { _id: teamId }, skip: !teamId });
  const { activeCycles } = useGetActiveCycles(teamId);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    value || 'no-cycle',
  );
  const selectedCycle = activeCycles?.find(
    (cycle) => cycle._id === selectedValue,
  );

  if (!team?.cycleEnabled) return null;
  return (
    <Select
      value={selectedValue}
      onValueChange={(value) => {
        setSelectedValue(value);
        onChange(value === 'no-cycle' ? undefined : value);
      }}
    >
      <Form.Control>
        <Select.Primitive.Trigger asChild>
          <Button variant="outline">
            {selectedCycle && <IconCalendarRepeat className="size-4" />}
            <span className="font-medium">
              <Select.Value placeholder="No cycle" />
            </span>
          </Button>
        </Select.Primitive.Trigger>
      </Form.Control>
      <Select.Content className=" max-h-[300px] w-[280px]">
        {selectedCycle !== undefined ? (
          <Select.Item
            key={selectedValue}
            value={selectedValue || ''}
            className="font-medium"
          >
            <TextOverflowTooltip value={selectedCycle.name} />
          </Select.Item>
        ) : (
          <Select.Item value="no-cycle" key="no-cycle">
            <span className="flex items-center gap-2 font-medium">
              <IconBan className="size-4" />
              No cycle
            </span>
          </Select.Item>
        )}
        <Select.Separator />

        {activeCycles && activeCycles.length > 0 ? (
          <>
            {selectedValue !== 'no-cycle' && (
              <Select.Item value="no-cycle" key="no-cycle">
                <span className="flex items-center gap-2 font-medium">
                  <IconBan className="size-4" />
                  No cycle
                </span>
              </Select.Item>
            )}
            {activeCycles
              .filter((cycle) => cycle._id !== selectedValue)
              .map((cycle) => (
                <Select.Item
                  key={cycle._id}
                  value={cycle._id}
                  className="font-medium"
                >
                  <TextOverflowTooltip value={cycle.name} />
                </Select.Item>
              ))}
          </>
        ) : (
          <SelectCycleEmpty />
        )}
      </Select.Content>
    </Select>
  );
};

const SelectCycleEmpty = () => {
  return (
    <div className="flex items-center gap-2 font-medium text-muted-foreground h-16 justify-center ">
      No cycle on the selected team
    </div>
  );
};
