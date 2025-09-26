import { useAutomation } from '@/automations/context/AutomationProvider';
import { useAutomationNodes } from '@/automations/hooks/useAutomationNodes';
import { useNodeConnect } from '@/automations/hooks/useNodeConnect';
import { useNodeEvents } from '@/automations/hooks/useNodeEvents';
import { automationDropHandler } from '@/automations/utils/automationBuilderUtils/dropNodeHandler';
import {
  buildPrimaryEdge,
  generateEdges,
} from '@/automations/utils/automationBuilderUtils/generateEdges';
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
import { splitAwaitingConnectionId } from '@/automations/utils/automationBuilderUtils/awaitingConnectionHandler';
import {
  AUTOMATION_NODE_TYPE_LIST_PROERTY,
  CONNECTION_PROPERTY_NAME_MAP,
} from '@/automations/constants';
import { useFormContext } from 'react-hook-form';
import { TAutomationBuilderForm } from '@/automations/utils/automationFormDefinitions';

export const useReactFlowEditor = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const editorWrapper = useRef<HTMLDivElement>(null);
  const { control } = useFormContext<TAutomationBuilderForm>();

  const theme = useAtomValue(themeState);
  const {
    awaitingToConnectNodeId,
    setAwaitingToConnectNodeId,
    reactFlowInstance,
    setReactFlowInstance,
    setQueryParams,
  } = useAutomation();
  const { triggers, actions, workflows, setNodesChangeToState } =
    useAutomationNodes();
  const { getNodes, updateNodeData, addNodes, setNodes, addEdges } =
    useReactFlow<Node<NodeData>>();

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
      // actions: newActions,
      // triggers: newTriggers,
      // workflows: newWorkflows,
      newNodeId,
      newNode,
      nodeType,
      generatedNode,
    } =
      automationDropHandler({
        triggers,
        actions,
        workflows,
        event,
        reactFlowInstance,
        getNodes,
      }) || {};
    // setNodesChangeToState({ newTriggers, newActions, newWorkflows });

    if (awaitingToConnectNodeId) {
      setAwaitingToConnectNodeId('');
    }

    if (nodes.find((node) => node.type === 'scratch')) {
      setNodes((nodes) => nodes.filter((node) => node.type !== 'scratch'));
    }
    if (newNodeId) {
      if (generatedNode) {
        addNodes(generatedNode);
        if (awaitingToConnectNodeId) {
          const [nodeType, nodeId] = splitAwaitingConnectionId(
            awaitingToConnectNodeId,
          );
          // addEdges(buildPrimaryEdge(nodeType, nodeId, newNodeId));

          // const listPropertyName = AUTOMATION_NODE_TYPE_LIST_PROERTY[nodeType]
          console.log({ nodeType, nodeId });
          onConnect({
            source: nodeId,
            target: newNodeId,
            sourceHandle: null,
            targetHandle: null,
          });
          updateNodeData(nodeId, {
            [CONNECTION_PROPERTY_NAME_MAP[nodeType]]: newNodeId,
          });
        }
      }
      setQueryParams({ activeNodeId: newNodeId });
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
