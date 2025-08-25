import { useAutomation } from '@/automations/context/AutomationProvider';
import { useAutomationNodes } from '@/automations/hooks/useAutomationNodes';
import { useNodeConnect } from '@/automations/hooks/useNodeConnect';
import { useNodeEvents } from '@/automations/hooks/useNodeEvents';
import { automationDropHandler } from '@/automations/utils/automationBuilderUtils/dropNodeHandler';
import { generateEdges } from '@/automations/utils/automationBuilderUtils/generateEdges';
import { generateNodes } from '@/automations/utils/automationBuilderUtils/generateNodes';
import {
  Node,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { themeState } from 'erxes-ui';
import { useAtomValue } from 'jotai';
import React, { useCallback, useRef } from 'react';
import { NodeData } from '../types';

export const useReactFlowEditor = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const editorWrapper = useRef<HTMLDivElement>(null);
  const theme = useAtomValue(themeState);
  const {
    awaitingToConnectNodeId,
    setAwaitingToConnectNodeId,
    reactFlowInstance,
    setReactFlowInstance,
  } = useAutomation();
  const { triggers, actions, workflows, setNodesChangeToState } =
    useAutomationNodes();
  const { getNodes, addNodes } = useReactFlow<Node<NodeData>>();

  const [nodes, _setNodes, onNodesChange] = useNodesState<Node<NodeData>>(
    generateNodes(triggers, actions, workflows),
  );
  const [edges, _setEdges, onEdgesChange] = useEdgesState<any>(
    generateEdges(triggers, actions, workflows),
  );

  const { onNodeDoubleClick, onNodeDragStop } = useNodeEvents();
  const { isValidConnection, onConnect } = useNodeConnect();

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const {
      actions: newActions,
      triggers: newTriggers,
      workflows: newWorkflows,
    } = automationDropHandler({
      triggers,
      actions,
      workflows,
      event,
      reactFlowInstance,
      getNodes,
      addNodes,
    }) || {};
    setNodesChangeToState({ newTriggers, newActions, newWorkflows });

    if (awaitingToConnectNodeId) {
      setAwaitingToConnectNodeId('');
    }
  };

  return {
    theme,
    nodes,
    edges,
    reactFlowWrapper,
    editorWrapper,
    onNodeDoubleClick,
    isValidConnection,
    onNodeDragStop,
    onDragOver,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDrop,
    setReactFlowInstance,
  };
};
