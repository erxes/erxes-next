import { LoadingSkeleton } from '@/automations/components/builder/sidebar/components/library/SidebarNodeLibrarySkeleton';
import { TDraggingNode } from '@/automations/components/builder/sidebar/states/automationNodeLibrary';
import { useAutomationsRecordTable } from '@/automations/hooks/useAutomationsRecordTable';
import { AutomationNodeType } from '@/automations/types';
import { ErrorState } from '@/automations/components/common/ErrorState';
import { ApolloError } from '@apollo/client';
import { IconArrowsSplit2, IconExternalLink } from '@tabler/icons-react';
import {
  Button,
  Card,
  cn,
  Command,
  IconComponent,
  RelativeDateDisplay,
  Tabs,
} from 'erxes-ui';
import React from 'react';
import { Link, useParams } from 'react-router';
import {
  IAutomationsActionConfigConstants,
  IAutomationsTriggerConfigConstants,
} from 'ui-modules';
import { useAutomationNodeLibrarySidebar } from '../../hooks/useAutomationNodeLibrarySidebar';
import { AUTOMATION_NODE_TYPES } from '@/automations/constants';

export const AutomationNodeLibrarySidebar = () => {
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

  const commonTabContentProps = {
    loading,
    error,
    refetch,
    onDragStart,
  };

  return (
    <Command className="h-full w-2xl">
      <Command.Input
        placeholder="Search..."
        variant="primary"
        className="pl-8"
      />

      <Tabs
        defaultValue={activeNodeTab || 'trigger'}
        onValueChange={(value) =>
          setQueryParams({ activeNodeTab: value as AutomationNodeType })
        }
        className="flex-1 flex flex-col overflow-auto"
      >
        <Tabs.List className="w-full border-b">
          {AUTOMATION_NODE_TYPES.map(({ value, label }) => (
            <Tabs.Trigger value={value} className="w-1/3">
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {[
          {
            type: 'trigger' as AutomationNodeType.Trigger,
            list: triggersConst,
          },
          { type: 'action' as AutomationNodeType.Action, list: actionsConst },
        ].map(({ type, list = [] }, index) => (
          <Tabs.Content
            key={index}
            value={type}
            className="flex-1 p-2 pt-0 mt-0 w-full overflow-auto flex-1"
          >
            <Command.Group className="space-y-2">
              <TabContentWrapper
                {...commonTabContentProps}
                type={type}
                list={list}
              />
            </Command.Group>
          </Tabs.Content>
        ))}
        <Tabs.Content className="space-y-2 " value="automation">
          <Command.Group>
            <AutomationsNodeLibrary {...commonTabContentProps} />
          </Command.Group>
        </Tabs.Content>
      </Tabs>
    </Command>
  );
};

const TabContentWrapper = ({
  loading,
  error,
  refetch,
  type,
  list,
  onDragStart,
}: {
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => void;
  type: AutomationNodeType;
  list:
    | IAutomationsTriggerConfigConstants[]
    | IAutomationsActionConfigConstants[];
  onDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    { type, label, description, icon, isCustom }: any,
  ) => void;
}) => {
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
  return (
    <>
      <Command.Empty />
      {list.map((item, index) => (
        <NodeLibraryRow
          key={index}
          item={item}
          nodeType={type}
          onDragStart={onDragStart}
        />
      ))}
    </>
  );
};

const NodeLibraryRow = ({
  item,
  onDragStart,
  nodeType,
}: {
  item: IAutomationsTriggerConfigConstants | IAutomationsActionConfigConstants;
  nodeType: AutomationNodeType;
  onDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    { type, label, description, icon, isCustom }: any,
  ) => void;
}) => {
  const { icon: iconName, label, description } = item;

  return (
    <Command.Item value={label} asChild>
      <Card
        className={cn(
          `cursor-pointer border-accent cursor-grab hover:bg-accent transition-colors h-16 mb-2 w-[350px] sm:w-[500px]`,
          {
            'hover:border-success': nodeType === 'action',
            'hover:border-primary': nodeType === 'trigger',
          },
        )}
        draggable
        onDragStart={(event) => onDragStart(event, { nodeType, ...item })}
      >
        <Card.Content className="p-3">
          <div className="flex items-center gap-4">
            <div
              className={cn(`p-3 rounded-lg`, {
                'bg-success/10 text-success border-success':
                  nodeType === 'action',
                'bg-primary/10 text-primary border-primary':
                  nodeType === 'trigger',
              })}
            >
              <IconComponent name={iconName} />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-4">
                <h3 className="font-semibold text-foreground text-sm">
                  {label || ''}
                </h3>
              </div>
              <p className="text-accent-foreground leading-relaxed text-xs">
                {description || ''}
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>
    </Command.Item>
  );
};

const AutomationsNodeLibrary = ({
  onDragStart,
}: {
  onDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    draggingNode: Extract<
      TDraggingNode,
      { nodeType: AutomationNodeType.Workflow }
    >,
  ) => void;
}) => {
  const { id } = useParams();

  const { list } = useAutomationsRecordTable({
    variables: { excludeIds: [id] },
  });

  return list.map(({ _id, name = '', createdAt = '' }) => (
    <Command.Item key={_id} value={name} asChild>
      <Card
        className="hover:shadow-md transition-shadow cursor-pointer border-accent cursor-grab hover:bg-accent transition-colors h-16 mb-2 w-[350px] sm:w-[500px] hover:border-warning"
        draggable
        onDragStart={(event) =>
          onDragStart(event, {
            nodeType: AutomationNodeType.Workflow,
            automationId: _id,
            name,
            description: 'Hello World',
          })
        }
      >
        <Card.Content className="p-3 w-full">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-warning/10 text-warning border-warning">
              <IconArrowsSplit2 />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-4">
                <h3 className="font-semibold text-foreground text-sm">
                  {name}
                </h3>
              </div>
              <p className="text-accent-foreground leading-relaxed text-xs">
                <RelativeDateDisplay.Value value={createdAt} />
              </p>
            </div>
            <Link to={`/automations/edit/${_id}`}>
              <Button variant="link">
                <IconExternalLink />
              </Button>
            </Link>
          </div>
        </Card.Content>
      </Card>
    </Command.Item>
  ));
};
