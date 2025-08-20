import { useAutomation } from '@/automations/context/AutomationProvider';
import { useNodeConnect } from '@/automations/hooks/useNodeConnect';
import { useNodeEvents } from '@/automations/hooks/useNodeEvents';
import { useAutomationNodes } from '@/automations/hooks/useAutomationNodes';
import { TAutomationBuilderForm } from '@/automations/utils/AutomationFormDefinitions';
import { Node, useEdgesState, useNodesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { themeState } from 'erxes-ui';
import { useAtomValue } from 'jotai';
import React, { useCallback, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { NodeData } from '../types';
import {
  automationDropHandler,
  generateEdges,
  generateNodes,
} from '../utils/automationBuilderUtils';
import isEqual from 'lodash/isEqual';

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
  const { setValue } = useFormContext<TAutomationBuilderForm>();
  const { triggers, actions, workflows } = useAutomationNodes();

  const [nodes, _setNodes, onNodesChange] = useNodesState<Node<NodeData>>(
    generateNodes(triggers, actions, workflows),
  );
  const [edges, _setEdges, onEdgesChange] = useEdgesState<any>(
    generateEdges(triggers, actions),
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
    }) || {};
    if (!isEqual(newTriggers, triggers)) {
      setValue('triggers', newTriggers);
    }
    if (!isEqual(newActions, actions)) {
      setValue('actions', newActions);
    }
    if (!isEqual(newWorkflows, workflows)) {
      console.log({ newWorkflows });
      setValue('workflows', newWorkflows);
    }

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
