import { useQuery } from '@apollo/client';
import { IconChevronDown } from '@tabler/icons-react';
import { Button, Combobox, Command, Popover, Select, Skeleton } from 'erxes-ui';
import { useState } from 'react';
import queries from 'ui-modules/modules/segments/graphql/queries';

type Props = {
  contentType: string;
  onSelect: (value: string) => void;
  customAttributions?: any[];
  attrConfig?: any;
};

type QueryResponse = {
  fieldsCombinedByContentType: any[];
};

export const Attributes = ({
  contentType,
  attrConfig,
  customAttributions,
  onSelect,
}: Props) => {
  const [open, setOpen] = useState(false);
  const { data, loading } = useQuery<QueryResponse>(
    queries.fieldsCombinedByContentType,
    {
      variables: {
        variables: {
          contentType,
          config: attrConfig ? attrConfig : undefined,
        },
      },
    },
  );

  const { fieldsCombinedByContentType: fields = [] } = data || {};

  const attributions = (fields || []).concat(customAttributions || []);

  return (
    <Popover>
      <Combobox.TriggerBase
        variant="link"
        size="sm"
        className="text-primary w-26 border-0"
      >
        Attributes
        <IconChevronDown />
      </Combobox.TriggerBase>
      {/* </Combobox.Trigger> */}
      <Combobox.Content>
        <Command>
          <Command.Input placeholder="Search attributes" />
          <Command.Empty>No attributes found.</Command.Empty>
          <Command.List>
            {attributions.map(({ value, label }) => (
              <Command.Item
                key={value}
                value={value}
                onSelect={(currentValue) => {
                  onSelect(currentValue === value ? '' : currentValue);
                }}
              >
                {label}
                <Combobox.Check checked={value === value} />
              </Command.Item>
            ))}
            {loading && <Skeleton />}
          </Command.List>
        </Command>
      </Combobox.Content>
    </Popover>
  );
};
