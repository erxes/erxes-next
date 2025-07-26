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
import { FormProvider, useForm } from 'react-hook-form';

import { Tabs, useMultiQueryState } from 'erxes-ui';
import { AutomationBuilderDnDProvider } from './AutomationBuilderDnDProvider';
import { AutomationBuilderHeader } from './AutomationBuilderHeader';
import { AutomationBuilderSidebar } from './sidebar/components/AutomationBuilderSidebar';

import { AutomationProvider } from '@/automations/components/builder/hooks/useAutomation';
import { PlaceHolderNode } from '@/automations/components/builder/nodes/PlaceHolderNode';
import { useReactFlowEditor } from '@/automations/hooks/useReactFlowEditor';
import {
  automationBuilderActiveTabState,
  automationBuilderSiderbarOpenState,
} from '@/automations/states/automationState';
import {
  automationBuilderFormSchema,
  TAutomationBuilderForm,
} from '@/automations/utils/AutomationFormDefinitions';
import { useAtom } from 'jotai';
import { IAutomation, NodeData } from '../../types';
import { deepCleanNulls } from '../../utils/automationBuilderUtils';
import ConnectionLine from './edges/connectionLine';
import PrimaryEdge from './edges/PrimaryEdge';
import { AutomationHistories } from './history/components/AutomationHistories';
import ActionNode from './nodes/ActionNode';
import TriggerNode from './nodes/TriggerNode';
import { AutomationBuilderEffect } from '@/automations/components/builder/AutomationBuilderEffect';

const nodeTypes = {
  trigger: TriggerNode as any,
  action: ActionNode as any,
  scratch: PlaceHolderNode,
};
const edgeTypes = {
  primary: PrimaryEdge,
};
const Builder = () => {
  const {
    theme,
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

    setReactFlowInstance,
  } = useReactFlowEditor();

  return (
    <div className="h-full" ref={reactFlowWrapper}>
      <AutomationBuilderEffect />
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

export const AutomationBuilder = ({ detail }: { detail?: IAutomation }) => {
  const [activeTab, setActiveTab] = useAtom(automationBuilderActiveTabState);
  const [isOpenSideBar, setOpenSidebar] = useAtom(
    automationBuilderSiderbarOpenState,
  );
  const [queryParams] = useMultiQueryState<{
    activeNodeId: string;
    activeTab: 'builder' | 'history';
  }>(['activeNodeId', 'activeTab']);

  const form = useForm<TAutomationBuilderForm>({
    resolver: zodResolver(automationBuilderFormSchema),
    defaultValues: deepCleanNulls(detail),
  });

  useEffect(() => {
    console.log({ activeTab, queryParamsactiveTab: queryParams.activeTab });
    if (activeTab !== queryParams.activeTab) {
      setActiveTab(queryParams.activeTab || 'builder');
    }

    if (queryParams.activeNodeId && !isOpenSideBar) {
      setOpenSidebar(true);
    }
  }, [queryParams?.activeTab, queryParams?.activeNodeId]);

  return (
    <AutomationProvider>
      <ReactFlowProvider>
        <AutomationBuilderDnDProvider>
          <FormProvider {...form}>
            <Tabs value={activeTab} className="h-screen flex flex-col">
              <AutomationBuilderHeader />
              {activeTab === 'builder' && (
                <Tabs.Content
                  value="builder"
                  className="flex-1 h-full relative"
                >
                  <Builder />
                  <AutomationBuilderSidebar />
                </Tabs.Content>
              )}
              {activeTab === 'history' && (
                <Tabs.Content
                  value="history"
                  className="flex-1 flex flex-col h-full"
                >
                  <AutomationHistories />
                </Tabs.Content>
              )}
            </Tabs>
          </FormProvider>
        </AutomationBuilderDnDProvider>
      </ReactFlowProvider>
    </AutomationProvider>
  );
};
