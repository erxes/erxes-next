import { IconAdjustments } from '@tabler/icons-react';
import { Button, DropdownMenu, DateFilterInDropdown } from 'erxes-ui';
import { useQueryState } from '../hooks/useQueryState';
import { BOOLEAN_FILTERS } from '../constants/booleanFilters';

export const FilterDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="data-[state=open]:bg-accent"
        >
          <IconAdjustments />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-64">
        <DropdownMenu.Tabs>
          <DropdownMenu.TabsContent>
            <DropdownMenu.TabsTrigger value="date">
              Filter by date
            </DropdownMenu.TabsTrigger>
            <DropdownMenu.Label>Assigned to</DropdownMenu.Label>
            {BOOLEAN_FILTERS.map((status) => (
              <BooleanStatus key={status.statusKey} {...status} />
            ))}
            <ResolvedStatus />
          </DropdownMenu.TabsContent>
          <DropdownMenu.TabsContent value="date">
            <DateFilterInDropdown filterId="date" />
          </DropdownMenu.TabsContent>
        </DropdownMenu.Tabs>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

export const BooleanStatus = ({
  statusKey,
  label,
}: {
  statusKey: string;
  label: string;
}) => {
  const [status, setStatus] = useQueryState<boolean>(statusKey);
  return (
    <DropdownMenu.CheckboxItem
      checked={!!status}
      onCheckedChange={(checked) => setStatus(checked ? true : null)}
    >
      {label}
    </DropdownMenu.CheckboxItem>
  );
};

export const ResolvedStatus = () => {
  const [status, setStatus] = useQueryState<string>('status');
  return (
    <DropdownMenu.CheckboxItem
      checked={status === 'closed'}
      onCheckedChange={(checked) => setStatus(checked ? 'closed' : null)}
    >
      Resolved
    </DropdownMenu.CheckboxItem>
  );
};
