import { gql, useQuery } from '@apollo/client';
import { IconChevronDown } from '@tabler/icons-react';
import {
  Button,
  Collapsible,
  Combobox,
  Command,
  EnumCursorDirection,
  Popover,
} from 'erxes-ui';
import {
  FIELDS_COMBINED_BY_CONTENT_TYPE,
  IField,
  useQuerySelectInputList,
} from '../../segments';

type Props = {
  contentType: string;
  selectedField?: IField;
  onSelect: (value: string) => void;
  customAttributions?: any[];
  attrConfig?: any;
  onlySet?: boolean;
  trigger?: React.ReactNode;
  ref?: any;
  buttonText?: string;
};

type QueryResponse = {
  fieldsCombinedByContentType: any[];
};

type SelectionProps = {
  selectionConfig: any;
  onSelect: (value: string) => void;
};

const RenderSelection = ({ selectionConfig, onSelect }: SelectionProps) => {
  const { queryName, labelField, valueField = '_id' } = selectionConfig || {};
  const query = gql`
        query ${queryName}($searchValue: String,$direction: CURSOR_DIRECTION,$cursor: String,$limit:Int) {
          ${queryName}(searchValue: $searchValue,direction:$direction,cursor:$cursor,limit:$limit) {
            list{${labelField},${valueField}}
            totalCount,
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      `;
  const {
    list = [],
    totalCount = 0,
    handleFetchMore,
    loading,
  } = useQuerySelectInputList(query, queryName, '', !selectionConfig);
  const items = list.map((option: any) => ({
    label: option[labelField],
    value: option[valueField],
  }));

  if (!selectionConfig) {
    return null;
  }

  return (
    <Collapsible className="space-y-2">
      <Collapsible.TriggerButton className="px-4">
        <div className="flex items-center gap-2">
          <span>Options</span>
          <Collapsible.TriggerIcon className="h-4 w-4" />
        </div>
      </Collapsible.TriggerButton>
      <Collapsible.Content className="px-4 m-0">
        <Command.Empty>Not found.</Command.Empty>
        <Command.Group value="queryOptions">
          <Combobox.Empty loading={loading} />
          {items.map((option: any) => (
            <Command.Item
              key={option.value}
              value={option.value}
              onSelect={onSelect}
            >
              {option.label}
            </Command.Item>
          ))}
          <Combobox.FetchMore
            currentLength={items?.length}
            totalCount={totalCount}
            fetchMore={() =>
              handleFetchMore({ direction: EnumCursorDirection.FORWARD })
            }
          />
        </Command.Group>
      </Collapsible.Content>
    </Collapsible>
  );
};

export const Attributes = ({
  trigger,
  selectedField,
  contentType,
  attrConfig,
  customAttributions,
  onSelect,
  onlySet,
  ref,
  buttonText,
}: Props) => {
  const { selectOptions = [], selectionConfig } = selectedField || {};
  const { data, loading } = useQuery<QueryResponse>(
    FIELDS_COMBINED_BY_CONTENT_TYPE,
    {
      variables: {
        contentType,
        config: attrConfig ? attrConfig : undefined,
      },
    },
  );

  const { fieldsCombinedByContentType: fields = [] } = data || {};

  const attributions = (fields || []).concat(customAttributions || []);

  const renderOptions = () => {
    if (!selectOptions?.length) {
      return null;
    }

    return (
      <Collapsible className="space-y-2">
        <Collapsible.TriggerButton className="px-4">
          <div className="flex items-center gap-2">
            <span>Options</span>
            <Collapsible.TriggerIcon className="h-4 w-4" />
          </div>
        </Collapsible.TriggerButton>
        <Collapsible.Content className="px-4 m-0">
          <Command.Empty>Not found.</Command.Empty>
          <Command.Group value="options">
            {selectOptions.map((option: any) => (
              <Command.Item
                key={String(option.value)}
                value={String(option.value)}
              >
                {option.label || '-'}
              </Command.Item>
            ))}
          </Command.Group>
        </Collapsible.Content>
      </Collapsible>
    );
  };

  return (
    <Popover>
      <Combobox.TriggerBase
        variant="link"
        size="sm"
        className="text-primary w-26 border-0"
        asChild
      >
        {trigger || (
          <Button variant="link">
            {buttonText} <IconChevronDown />
          </Button>
        )}
      </Combobox.TriggerBase>
      <Combobox.Content>
        <Command ref={ref}>
          <Command.Input placeholder="Search ..." />

          <Command.List>
            <Collapsible className="space-y-2">
              <Collapsible.TriggerButton className="px-4">
                <div className="flex items-center gap-2">
                  <span>Attributes</span>
                  <Collapsible.TriggerIcon className="h-4 w-4" />
                </div>
              </Collapsible.TriggerButton>
              <Collapsible.Content className="px-4 m-0">
                <Command.Empty>Not found.</Command.Empty>
                <Command.Group value="attributes">
                  {attributions.map(({ name, label }) => (
                    <Command.Item key={name} value={name} onSelect={onSelect}>
                      {label}
                    </Command.Item>
                  ))}
                  <Combobox.Empty loading={loading} />
                </Command.Group>
              </Collapsible.Content>
            </Collapsible>

            {renderOptions()}
            <RenderSelection
              selectionConfig={selectionConfig}
              onSelect={onSelect}
            />
          </Command.List>
        </Command>
      </Combobox.Content>
    </Popover>
  );
};
