import { gql, useQuery } from '@apollo/client';
import { IconChevronDown } from '@tabler/icons-react';
import { Button, Combobox, Command, Popover, Select, Skeleton } from 'erxes-ui';
import { useState } from 'react';
import { useFieldSelectionList } from 'ui-modules/modules/segments';
import queries from 'ui-modules/modules/segments/graphql/queries';

type Props = {
  contentType: string;
  selectedField: any;
  selectedOperator: any;
  onSelect: (value: string) => void;
  customAttributions?: any[];
  attrConfig?: any;
  onlySet?: boolean;
  trigger?: React.ReactNode;
};

type QueryResponse = {
  fieldsCombinedByContentType: any[];
};

type SelectionProps = {
  selectionConfig: any;
  onSelect: (value: string) => void;
};

const renderSelection = ({ selectionConfig, onSelect }: SelectionProps) => {
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
  } = useFieldSelectionList(query, queryName, '', !selectionConfig);
  const items = list.map((option: any) => ({
    label: option[labelField],
    value: option[valueField],
  }));

  if (!selectionConfig) {
    return null;
  }

  return (
    <Command.Group heading="Options" value="options">
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
        fetchMore={() => handleFetchMore({ direction: 'forward' })}
      />
    </Command.Group>
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
}: Props) => {
  const { selectOptions = [], selectionConfig } = selectedField || {};
  const { data, loading } = useQuery<QueryResponse>(
    queries.fieldsCombinedByContentType,
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
      <Command.Group heading="Options" value="options">
        {selectOptions.map((option: any) => (
          <Command.Item key={String(option.value)} value={String(option.value)}>
            {option.label || '-'}
          </Command.Item>
        ))}
      </Command.Group>
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
            Add <IconChevronDown />
          </Button>
        )}
      </Combobox.TriggerBase>
      {/* </Combobox.Trigger> */}
      <Combobox.Content>
        <Command>
          <Command.Input placeholder="Search ..." />
          <Command.Empty>Not found.</Command.Empty>
          <Command.List>
            <Command.Group heading="Attributes" value="attributes">
              {attributions.map(({ name, label }) => (
                <Command.Item key={name} value={name} onSelect={onSelect}>
                  {label}
                </Command.Item>
              ))}
              <Combobox.Empty loading={loading} />
            </Command.Group>
            {renderOptions()}
            {renderSelection({ selectionConfig, onSelect })}
          </Command.List>
        </Command>
      </Combobox.Content>
    </Popover>
  );
};
