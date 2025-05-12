import { DocumentNode, gql, useQuery } from '@apollo/client';
import { Combobox, Command, Popover } from 'erxes-ui';
import {
  mergeCursorData,
  useRecordTableCursor,
  EnumCursorDirection,
} from 'erxes-ui';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import segmentFormSchema from '../form/schema';
import { UseFormReturn } from 'react-hook-form';
import { IConditionsForPreview } from '../types';
import { z } from 'zod';

type CommandProps = {
  query: DocumentNode;
  queryName: string;
  labelField: string;
  valueField: string;
  focusOnMount: any;
  nullable: boolean;
  onSelect: (optionId: string | null) => void;
  initialValue: string;
};

const useList = (
  query: DocumentNode,
  queryName: string,
  searchValue: string,
) => {
  const PER_PAGE = 30;
  const { cursor } = useRecordTableCursor({
    sessionKey: 'property_cursor',
  });
  const { data, loading, error, fetchMore } = useQuery(query, {
    variables: {
      limit: PER_PAGE,
      cursor,
      searchValue: searchValue ?? undefined,
    },
  });

  const { list, totalCount, pageInfo } = (data || {})[queryName] || {};

  const handleFetchMore = ({
    direction,
  }: {
    direction: 'forward' | 'backward';
    onFetchMoreCompleted?: (fetchMoreResult: {
      [queryName: string]: {
        list: any[];
      };
    }) => void;
  }) => {
    if (
      (direction === 'forward' && pageInfo?.hasNextPage) ||
      (direction === 'backward' && pageInfo?.hasPreviousPage)
    ) {
      return fetchMore({
        variables: {
          cursor:
            direction === 'forward'
              ? pageInfo?.endCursor
              : pageInfo?.startCursor,
          limit: PER_PAGE,
          direction,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          const { pageInfo: fetchMorePageInfo, list: fetchMoreList = [] } =
            (fetchMoreResult || {})[queryName];

          const { pageInfo: prevPageInfo, list: prevList = [] } =
            (prev || {})[queryName] || {};

          // setCursor(prevPageInfo?.endCursor);

          return Object.assign({}, prev, {
            [queryName]: mergeCursorData({
              direction: EnumCursorDirection.FORWARD,
              fetchMoreResult: {
                pageInfo: fetchMorePageInfo,
                list: fetchMoreList,
              },
              prevResult: {
                pageInfo: prevPageInfo,
                list: prevList,
              },
            }),
          });
        },
      });
    }
  };

  return {
    list,
    loading,
    totalCount,
    handleFetchMore,
  };
};

export const SelectCommand = ({
  query,
  queryName,
  labelField,
  valueField,
  focusOnMount,
  nullable,
  onSelect,
  initialValue,
}: CommandProps) => {
  const [search, setSearch] = useState('');
  const [value, setValue] = useState(initialValue || '');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [debouncedSearch] = useDebounce(search, 500);
  const {
    list = [],
    totalCount = 0,
    handleFetchMore,
  } = useList(query, queryName, search);
  const items = list.map((option: any) => ({
    label: option[labelField],
    value: option[valueField],
  }));
  const selectedValue = items?.find(
    (option: any) => option._id === value,
  )?.value;

  useEffect(() => {
    if (inputRef.current && focusOnMount) {
      inputRef.current.focus();
    }
  }, [focusOnMount]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Combobox.Trigger>
        <Combobox.Value value={selectedValue} />
      </Combobox.Trigger>
      <Combobox.Content>
        <Command>
          <Command.Input placeholder={`Search ${labelField}...`} />

          <Command.List>
            <Command.Empty>No {labelField}.</Command.Empty>
            {items.map((option: any) => (
              <Command.Item
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  setValue(
                    currentValue && currentValue === selectedValue
                      ? ''
                      : currentValue,
                  );
                  setOpen(false);
                }}
              >
                {option.label}
                <Combobox.Check checked={selectedValue === option.value} />
              </Command.Item>
            ))}
            <Combobox.FetchMore
              currentLength={items?.length}
              totalCount={totalCount}
              fetchMore={() => handleFetchMore({ direction: 'forward' })}
            />
          </Command.List>
        </Command>
      </Combobox.Content>
    </Popover>
  );
};

export const generateParamsPreviewCount = (
  form: UseFormReturn<z.infer<typeof segmentFormSchema>>,
  selectedContentType: string,
) => {
  const conditions = form.watch('conditions');
  const conditionSegments = form.watch('conditionSegments');
  const conditionsConjunction = form.watch('conditionsConjunction');

  const conditionsForPreview: IConditionsForPreview[] = [];

  if (conditions?.length) {
    conditionsForPreview.push({
      type: 'subSegment',
      subSegmentForPreview: {
        key: Math.random().toString(),
        contentType: selectedContentType || '',
        conditionsConjunction,
        conditions: conditions,
      },
    });
  }

  if (conditionSegments?.length) {
    conditionSegments.forEach((segment) => {
      conditionsForPreview.push({
        type: 'subSegment',
        subSegmentForPreview: {
          key: Math.random().toString(),
          ...segment,
          conditions: segment.conditions || [],
        },
      });
    });
  }

  return conditionsForPreview;
};
