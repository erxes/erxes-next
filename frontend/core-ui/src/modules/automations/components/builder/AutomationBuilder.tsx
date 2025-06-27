import {
  Background,
  Controls,
  Edge,
  EdgeProps,
  MiniMap,
  Node,
  OnInit,
  ReactFlow,
  ReactFlowInstance,
  ReactFlowProvider,
} from '@xyflow/react';
import { useEffect, useState } from 'react';

import '@xyflow/react/dist/style.css';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { useMultiQueryState, useQueryState } from 'erxes-ui';
import { AutomationBuilderDnDProvider } from './AutomationBuilderDnDProvider';
import { AutomationBuilderHeader } from './AutomationBuilderHeader';
import { AutomationBuilderSidebar } from './sidebar/components/AutomationBuilderSidebar';

import { useReactFlowEditor } from '@/automations/hooks/useReactFlowEditor';
import {
  automationBuilderFormSchema,
  TAutomationProps,
} from '@/automations/utils/AutomationFormDefinitions';
import { IAutomation, NodeData } from '../../types';
import { deepCleanNulls } from '../../utils/automationBuilderUtils';
import { AutomationHistories } from './AutomationHistories';
import ConnectionLine from './edges/connectionLine';
import PrimaryEdge from './edges/PrimaryEdge';
import ActionNode from './nodes/ActionNode';
import TriggerNode from './nodes/TriggerNode';
import { AutomationProvider } from '@/automations/components/builder/hooks/useAutomation';
import { PlaceHolderNode } from '@/automations/components/builder/nodes/PlaceHolderNode';

const nodeTypes = {
  trigger: TriggerNode as any,
  action: ActionNode as any,
  scratch: PlaceHolderNode,
};
const edgeTypes = {
  primary: PrimaryEdge,
};
const Builder = ({
  reactFlowInstance,
  setReactFlowInstance,
}: {
  reactFlowInstance: ReactFlowInstance<Node<NodeData>, Edge<EdgeProps>>;
  setReactFlowInstance: OnInit<Node<NodeData>, Edge<EdgeProps>>;
}) => {
  const {
    theme,
    resetNodes,
    reactFlowWrapper,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    editorWrapper,
    onConnect,
    onDrop,
    isValidConnection,
    onNodeDoubleClick,
    onNodeDragStop,
    onDragOver,
    triggers,
    actions,
  } = useReactFlowEditor({ reactFlowInstance });

  useEffect(() => {
    resetNodes();
  }, [JSON.stringify(triggers), JSON.stringify(actions)]);

  return (
    <div className="h-full" ref={reactFlowWrapper}>
      <ReactFlow
        ref={editorWrapper}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        isValidConnection={isValidConnection}
        onNodeDoubleClick={onNodeDoubleClick}
        onInit={setReactFlowInstance}
        onDragOver={onDragOver}
        fitView
        connectionLineComponent={ConnectionLine}
        onNodeDragStop={onNodeDragStop}
        colorMode={theme}
        minZoom={0.1}
      >
        <Controls />
        <Background />
        <MiniMap pannable position="top-left" />
      </ReactFlow>
    </div>
  );
};

const AutomationBuilderWrapper = ({
  activeTab,
  reactFlowInstance,
  setReactFlowInstance,
}: {
  activeTab: 'builder' | 'history';
  reactFlowInstance: ReactFlowInstance<Node<NodeData>, Edge<EdgeProps>>;
  setReactFlowInstance: OnInit<Node<NodeData>, Edge<EdgeProps>>;
}) => {
  if (activeTab === 'history') {
    return <AutomationHistories />;
  }

  return (
    <div className="relative h-full flex flex-col grow">
      <Builder
        reactFlowInstance={reactFlowInstance}
        setReactFlowInstance={setReactFlowInstance}
      />
      <AutomationBuilderSidebar />
    </div>
  );
};

export const AutomationBuilder = ({ detail }: { detail?: IAutomation }) => {
  const [queryParams] = useMultiQueryState<{
    activeNodeId: string;
    activeTab: 'builder' | 'history';
  }>(['activeNodeId', 'activeTab']);
  const { activeNodeId, activeTab } = queryParams;

  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const form = useForm<TAutomationProps>({
    resolver: zodResolver(automationBuilderFormSchema),
    defaultValues: {
      isMinimized: activeNodeId ? false : true,
      activeTab: activeTab || 'builder',
      detail: deepCleanNulls(detail),
    },
  });

  const activeBulderTab = form.watch('activeTab');

  return (
    <AutomationProvider>
      <ReactFlowProvider>
        <AutomationBuilderDnDProvider>
          <FormProvider {...form}>
            <AutomationBuilderHeader reactFlowInstance={reactFlowInstance} />
            <AutomationBuilderWrapper
              activeTab={activeBulderTab}
              reactFlowInstance={reactFlowInstance}
              setReactFlowInstance={setReactFlowInstance}
            />
          </FormProvider>
        </AutomationBuilderDnDProvider>
      </ReactFlowProvider>
    </AutomationProvider>
  );
};
