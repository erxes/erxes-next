import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import { useEffect, useState } from 'react';

import '@xyflow/react/dist/style.css';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import { useMultiQueryState, useQueryState } from 'erxes-ui';
import { AutomationBuilderDnDProvider } from './AutomationBuilderDnDProvider';
import { AutomationBuilderHeader } from './AutomationBuilderHeader';
import { AutomationBuilderSidebar } from './sidebar/components/AutomationBuilderSidebar';

import { useReactFlowEditor } from '@/automations/hooks/useReactFlowEditor';
import {
  automationBuilderFormSchema,
  TAutomationProps,
} from '@/automations/utils/AutomationFormDefinitions';
import { IAutomation } from '../../types';
import { deepCleanNulls } from '../../utils/automationBuilderUtils';
import { AutomationHistories } from './AutomationHistories';
import ConnectionLine from './edges/connectionLine';
import PrimaryEdge from './edges/primary';
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
const Builder = ({ reactFlowInstance, setReactFlowInstance }: any) => {
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
        style={{ backgroundColor: '#F7F9FB' }}
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

export const AutomationBuilder = ({ detail }: { detail?: IAutomation }) => {
  const [queryParams] = useMultiQueryState<{
    activeNodeId: string;
    activeTab: string;
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

  return (
    <AutomationProvider>
      <ReactFlowProvider>
        <AutomationBuilderDnDProvider>
          <FormProvider {...form}>
            <AutomationBuilderHeader reactFlowInstance={reactFlowInstance} />

            {form.watch('activeTab') === 'history' ? (
              <AutomationHistories />
            ) : (
              <div className="relative h-full flex flex-col grow">
                <Builder
                  reactFlowInstance={reactFlowInstance}
                  setReactFlowInstance={setReactFlowInstance}
                />
                <AutomationBuilderSidebar />
              </div>
            )}
          </FormProvider>
        </AutomationBuilderDnDProvider>
      </ReactFlowProvider>
    </AutomationProvider>
  );
};
