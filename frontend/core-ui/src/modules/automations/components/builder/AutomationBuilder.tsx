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

import { useQueryState } from 'erxes-ui';
import { AutomationBuilderDnDProvider } from './AutomationBuilderDnDProvider';
import { AutomationBuilderHeader } from './AutomationBuilderHeader';
import { AutomationBuilderSidebar } from './AutomationBuilderSidebar';

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
import ActionNode from './nodes/Action';
import TriggerNode from './nodes/Trigger';

const nodeTypes = {
  trigger: TriggerNode as any,
  action: ActionNode as any,
};
const edgeTypes = {
  primary: PrimaryEdge,
};
const Editor = ({ reactFlowInstance, setReactFlowInstance }: any) => {
  const {
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
    <div
      className="flex flex-column grow h-full relative"
      ref={reactFlowWrapper}
    >
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
      >
        <Controls />
        <Background />
        <MiniMap pannable position="top-left" />
      </ReactFlow>
      <AutomationBuilderSidebar />
    </div>
  );
};

export default ({ detail }: { detail?: IAutomation }) => {
  const [activeNodeId] = useQueryState('activeNodeId');
  const [activeTabQueryParam] = useQueryState<'builder' | 'history'>(
    'activeTab',
  );
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const form = useForm<TAutomationProps>({
    resolver: zodResolver(automationBuilderFormSchema),
    defaultValues: {
      isMinimized: activeNodeId ? false : true,
      activeTab: activeTabQueryParam || 'builder',
      detail: deepCleanNulls(detail),
    },
  });

  const activeTab = form.watch('activeTab');

  return (
    <ReactFlowProvider>
      <AutomationBuilderDnDProvider>
        <FormProvider {...form}>
          <AutomationBuilderHeader reactFlowInstance={reactFlowInstance} />

          {activeTab === 'history' ? (
            <AutomationHistories />
          ) : (
            <Editor
              reactFlowInstance={reactFlowInstance}
              setReactFlowInstance={setReactFlowInstance}
            />
          )}
        </FormProvider>
      </AutomationBuilderDnDProvider>
    </ReactFlowProvider>
  );
};
