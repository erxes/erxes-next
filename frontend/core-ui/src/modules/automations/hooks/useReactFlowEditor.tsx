import { useAutomation } from '@/automations/components/builder/hooks/useAutomation';
import { useResetNodes } from '@/automations/hooks/useResetNodes';
import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import {
  addEdge,
  Connection,
  Edge,
  EdgeProps,
  Node,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { themeState } from 'erxes-ui';
import { useAtomValue } from 'jotai';
import React, { useCallback, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { IAction, ITrigger } from 'ui-modules';
import { NodeData } from '../types';
import {
  automationDropHandler,
  generateEdges,
  generateNodes,
} from '../utils/automationBuilderUtils';
import {
  checkIsValidConnect,
  connectionHandler,
  generateConnect,
} from '../utils/automationConnectionUtils';

export const useReactFlowEditor = ({
  reactFlowInstance,
}: {
  reactFlowInstance: ReactFlowInstance<Node<NodeData>, Edge<EdgeProps>>;
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const editorWrapper = useRef<HTMLDivElement>(null);
  const { triggersConst, actionsConst } = useAutomation();
  const { watch, setValue } = useFormContext<TAutomationProps>();
  const {
    awaitingToConnectNodeId,
    setAwaitingToConnectNodeId,
    setQueryParams,
  } = useAutomation();

  const theme = useAtomValue(themeState);

  const [triggers = [], actions = []] = watch([
    'detail.triggers',
    'detail.actions',
  ]);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<NodeData>>(
    generateNodes({ triggers, actions }, {}),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>(
    generateEdges({
      triggers,
      actions,
      workFlowActions: [],
    }),
  );

  const { resetNodes } = useResetNodes({
    nodes,
    triggers,
    actions,
    setEdges,
    setNodes,
  });

  const onConnection = (info: any) => {
    connectionHandler(triggers, actions, info, info.targetId, []);
  };

  const onConnect = useCallback(
    (params: Connection) => {
      const source = nodes.find((node) => node.id === params.source);
      setEdges((eds) => {
        const updatedEdges = addEdge({ ...params }, eds);

        onConnection(generateConnect(params, source));

        return updatedEdges;
      });
    },
    [nodes],
  );
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const { actions: newActions, triggers: newTriggers } =
      automationDropHandler({
        event,
        reactFlowInstance,
        triggers,
        actions,
      }) || {};

    setValue('detail.actions', newActions);
    setValue('detail.triggers', newTriggers);

    if (awaitingToConnectNodeId) {
      setAwaitingToConnectNodeId('');
    }
  };

  const onNodeDragStop = (_: any, node: Node<NodeData>) => {
    const nodeType = node.data.nodeType as 'trigger' | 'action';
    const names = {
      trigger: triggers,
      action: actions,
    };
    const list = names[nodeType] as ITrigger[] | IAction[];

    if (!list?.length) {
      return;
    }

    setValue(
      `detail.${nodeType}s`,
      list.map((item) =>
        item.id === node.id ? { ...item, position: node.position } : item,
      ),
    );
  };

  const isValidConnection = useCallback(
    (connection: Connection) =>
      checkIsValidConnect({
        nodes,
        edges,
        connection,
        triggersConst,
        actionsConst,
      }),
    [nodes, edges],
  );

  const onNodeDoubleClick = (event: any, node: Node<NodeData>) => {
    const target = event.target as HTMLElement;

    const isCollapsibleTrigger = target.closest('[data-collapsible-trigger]');
    const isButton = target.closest('button');

    if (isCollapsibleTrigger || isButton) {
      return; // Prevent double-click action
    }

    setValue('activeNode', { ...node.data, id: node.id });
    setValue('isMinimized', false);
    setQueryParams({ activeNodeId: node.id });
  };

  return {
    theme,
    triggers,
    actions,
    nodes,
    edges,
    reactFlowWrapper,
    editorWrapper,
    resetNodes,
    onNodeDoubleClick,
    isValidConnection,
    onNodeDragStop,
    onDragOver,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDrop,
  };
};
