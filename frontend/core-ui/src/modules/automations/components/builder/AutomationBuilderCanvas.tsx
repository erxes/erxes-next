import { PlaceHolderNode } from '@/automations/components/builder/nodes/PlaceHolderNode';
import { useReactFlowEditor } from '@/automations/hooks/useReactFlowEditor';
import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react';
import ConnectionLine from './edges/connectionLine';
import PrimaryEdge from './edges/PrimaryEdge';
import ActionNode from './nodes/ActionNode';
import TriggerNode from './nodes/TriggerNode';
import WorkflowNode from '@/automations/components/builder/nodes/WorkflowNode';
import { AutomationBuilderSidebar } from '@/automations/components/builder/sidebar/components/AutomationBuilderSidebar';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  workflow: WorkflowNode,
  scratch: PlaceHolderNode,
};
const edgeTypes = {
  primary: PrimaryEdge,
};

export const AutomationBuilderCanvas = () => {
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
    <div className="h-full flex-1" ref={reactFlowWrapper}>
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
        minZoom={0.5}
      >
        <Controls />
        <Background />
        <MiniMap pannable position="top-left" zoomable />
      </ReactFlow>
      <AutomationBuilderSidebar />
    </div>
  );
};
