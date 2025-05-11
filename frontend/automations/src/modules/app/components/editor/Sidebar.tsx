import {
  Bot,
  Building,
  CheckSquare,
  ChevronRight,
  Facebook,
  FormInput,
  MessageCircle,
  Rss,
  Search,
  ShoppingCart,
  Ticket,
  User,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { useDnD } from './DnDProvider';
// import {
//     type NodeProps,
//     Handle,
//     Position
// } from "reactflow"
import '@xyflow/react/dist/style.css';
import {
  Button,
  Card,
  Input,
  ScrollArea,
  Sheet,
  Skeleton,
  Tabs,
  // TabsContent, TabsList, TabsTrigger
} from 'erxes-ui/components';
import { TablerIcon } from 'erxes-ui/icons';
import { ApolloError, gql, useQuery } from '@apollo/client';
import { ConstantsQueryResponse } from '../../types';
import queries from '../../graphql/queries';
import {
  IconArrowsDiagonalMinimize,
  IconHandClick,
  IconMinimize,
  IconMinus,
  IconSettingsBolt,
} from '@tabler/icons-react';
import ErrorState from './common/EmptyState';
import { useFormContext } from 'react-hook-form';
import { cn } from 'erxes-ui/lib';

const TabsContent = (
  nodeType: string,
  list: any[],
  onDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
    nodeModule: string,
    nodeLabel: string,
    nodeDescription: string,
  ) => void,
  searchValue: string,
) => {
  if (searchValue) {
    list = list.filter((item) => new RegExp(searchValue, 'i').test(item.label));
  }

  return list.map((item, index) => (
    <Card
      key={index}
      className="cursor-grab hover:bg-slate-50 transition-colors"
      draggable
      onDragStart={(event) =>
        onDragStart(
          event,
          nodeType,
          item?.module,
          item?.label,
          item?.description,
        )
      }
    >
      <Card.Header className="p-3">
        <Card.Title className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`h-5 w-5 rounded-full flex items-center justify-center`}
            >
              <TablerIcon name={`Icon${item?.icon}` as any} />
            </div>
            <span>{item?.label}</span>
          </div>
        </Card.Title>
        <p className="text-xs text-muted-foreground mt-1">
          {item?.description}
        </p>
      </Card.Header>
    </Card>
  ));
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
      {Array.from({ length: 5 }).map(() => (
        <LoadingRow />
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

export default ({ constants }: any) => {
  const { watch, setValue } = useFormContext();
  const isMinimized = watch('isMinimized');
  const { data, loading, error, refetch } = useQuery<ConstantsQueryResponse>(
    gql(queries.automationConstants),
    { fetchPolicy: 'network-only' },
  );

  const { triggersConst, actionsConst } = data?.automationConstants || {};

  const [_, setType] = useDnD();
  const [searchValue, setSearchValue] = useState('');
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeTemplates, setActiveTemplates] = useState(false);

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
    nodeModule: string,
    nodeLabel: string,
    nodeDescription: string,
  ) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/module', nodeModule);
    event.dataTransfer.setData('application/reactflow/label', nodeLabel);
    event.dataTransfer.setData(
      'application/reactflow/description',
      nodeDescription,
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  // Filter templates based on search term and active module

  return (
    <div
      className={cn(
        'absolute top-0 right-0  w-80 h-full  border rounded-lg transition-transform duration-300 bg-white z-10',
        isMinimized ? 'invisible' : 'visible',
      )}
    >
      <div className="flex h-full flex-col bg-background shadow-md">
        <div className="p-4 border-b">
          <h3 className="font-medium mb-3">Workflow Components</h3>
          <div className="relative flex items-center">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              className="pl-8"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="trigger" className="flex-1 flex flex-col">
          <div className="px-4 pt-2">
            <Tabs.List size="sm" className="w-full">
              <Tabs.Trigger size="sm" value="trigger" className="flex-1">
                {/* <IconHandClick /> */}
                Triggers
              </Tabs.Trigger>
              <Tabs.Trigger size="sm" value="action" className="flex-1">
                {/* <IconSettingsBolt /> */}
                Actions
              </Tabs.Trigger>
            </Tabs.List>
          </div>

          {[
            { type: 'trigger', list: triggersConst },
            { type: 'action', list: actionsConst },
          ].map(({ type, list = [] }) => (
            <Tabs.Content value={type} className=" flex-1 p-4 mt-0 w-full">
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
    </div>
  );
};
