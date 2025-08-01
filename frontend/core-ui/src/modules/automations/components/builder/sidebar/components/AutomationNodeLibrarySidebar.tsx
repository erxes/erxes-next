import { ErrorState } from '@/automations/utils/ErrorState';
import { ApolloError } from '@apollo/client';
import { Card, Input, Skeleton, Tabs, Badge } from 'erxes-ui';
import React, { useState } from 'react';
import { useAutomationNodeLibrarySidebar } from '../hooks/useAutomationNodeLibrarySidebar';
import { IconCodeVariable, IconSearch } from '@tabler/icons-react';

const TabsContent = (
  nodeType: string,
  list: any[],
  onDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
    node: any,
  ) => void,
  searchValue: string,
) => {
  if (searchValue) {
    list = list.filter((item) => new RegExp(searchValue, 'i').test(item.label));
  }

  return list.map((item, index) => {
    const color = nodeType === 'action' ? 'success' : 'primary';

    return (
      <Card
        key={index}
        className={`hover:shadow-md transition-shadow cursor-pointer border-accent hover:border-${color} cursor-grab hover:bg-accent transition-colors mb-2 w-[500px]`}
        draggable
        onDragStart={(event) => onDragStart(event, nodeType, item)}
      >
        <Card.Content className="p-3">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 bg-${color}/10 text-${color} border-${color} rounded-lg`}
            >
              <IconCodeVariable />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-4">
                <h3 className="font-semibold text-foreground text-sm">
                  {item?.label}
                </h3>
              </div>
              <p className="text-accent-foreground leading-relaxed text-xs">
                {item?.description}
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>
    );
  });
};

const LoadingSkeleton = () => {
  const LoadingRow = () => {
    return (
      <Card className="flex flex-col  gap-2 space-x-4 border rounded-xl p-3 cursor-wait">
        <Card.Title className="flex flex-row w-full items-center gap-3">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-4 w-2/3" />
        </Card.Title>
        <Card.Description>
          <Skeleton className="h-4 w-4/5" />
        </Card.Description>
      </Card>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <LoadingRow key={index} />
      ))}
    </div>
  );
};

const TabContentWrapper = (
  loading: boolean,
  error: ApolloError | undefined,
  refetch: () => void,
  { type, list, onDragStart, searchValue }: any,
) => {
  if (loading) {
    return <LoadingSkeleton />;
  }
  if (error) {
    return (
      <ErrorState
        errorCode={error.message}
        errorDetails={error.stack}
        onRetry={refetch}
      />
    );
  }
  return <div>{TabsContent(type, list, onDragStart, searchValue)}</div>;
};

export const AutomationNodeLibrarySidebar = () => {
  const [searchValue, setSearchValue] = useState('');
  const {
    actionsConst,
    setQueryParams,
    activeNodeTab,
    triggersConst,
    loading,
    error,
    refetch,
    onDragStart,
  } = useAutomationNodeLibrarySidebar();

  return (
    <div>
      <div className="p-4 border-b">
        <div className="relative flex items-center">
          <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            className="pl-8"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        defaultValue={activeNodeTab || 'trigger'}
        onValueChange={(value) =>
          setQueryParams({ activeNodeTab: value as 'trigger' | 'action' })
        }
        className="flex-1 flex flex-col"
      >
        <div className="px-4 pt-2">
          <Tabs.List size="sm" className="w-full">
            <Tabs.Trigger size="sm" value="trigger" className="flex-1">
              Triggers
            </Tabs.Trigger>
            <Tabs.Trigger size="sm" value="action" className="flex-1">
              Actions
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        {[
          { type: 'trigger', list: triggersConst },
          { type: 'action', list: actionsConst },
        ].map(({ type, list = [] }, index) => (
          <Tabs.Content
            key={index}
            value={type}
            className=" flex-1 p-4 mt-0 w-full"
          >
            <div className="space-y-2">
              {TabContentWrapper(loading, error, refetch, {
                type,
                list,
                onDragStart,
                searchValue,
              })}
            </div>
          </Tabs.Content>
        ))}
      </Tabs>
    </div>
  );
};
