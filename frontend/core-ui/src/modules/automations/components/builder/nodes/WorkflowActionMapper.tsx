import ConnectionLine from '@/automations/components/builder/edges/connectionLine';
import PrimaryEdge from '@/automations/components/builder/edges/PrimaryEdge';
import ActionNode from '@/automations/components/builder/nodes/ActionNode';
import { PlaceHolderNode } from '@/automations/components/builder/nodes/PlaceHolderNode';
import TriggerNode from '@/automations/components/builder/nodes/TriggerNode';
import WorkflowNode from '@/automations/components/builder/nodes/WorkflowNode';
import { AUTOMATION_DETAIL } from '@/automations/graphql/automationQueries';
import { AutomationNodeType, IAutomation, NodeData } from '@/automations/types';
import {
  generateEdges,
  generateNodes,
} from '@/automations/utils/automationBuilderUtils';
import { useQuery } from '@apollo/client';
import {
  Background,
  ConnectionMode,
  Controls,
  MiniMap,
  Node,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { Checkbox, Spinner, themeState } from 'erxes-ui';
import { useAtomValue } from 'jotai';
import { memo, useRef } from 'react';
import { IAction } from 'ui-modules';

export const WorkflowActionMapper = ({ id }: { id?: string }) => {
  const { data, loading } = useQuery<{ automationDetail: IAutomation }>(
    AUTOMATION_DETAIL,
    {
      variables: { id },
      skip: !id,
    },
  );

  if (loading) {
    return <Spinner />;
  }

  const detail = data?.automationDetail;
  console.log({ detail });

  if (!detail) {
    return 'Not found';
  }

  return <WorkflowActionCanvas actions={detail.actions || []} />;
};

const useWorkflowMapperBeforeTitleContent = () => {
  const beforeTitleContent = (id: string, type: AutomationNodeType) => {
    return (
      <Checkbox className="data-[state=checked]:border-success data-[state=indeterminate]:border-success data-[state=checked]:bg-success data-[state=indeterminate]:bg-success" />
    );
  };

  return { beforeTitleContent };
};

const WorkflowActionCanvas = ({ actions }: { actions: IAction[] }) => {
  const { beforeTitleContent } = useWorkflowMapperBeforeTitleContent();
  const theme = useAtomValue(themeState);

  const [nodes] = useNodesState<Node<NodeData>>(
    generateNodes([], actions, [], { beforeTitleContent }),
  );
  const [edges] = useEdgesState<any>(generateEdges([], actions));

  return (
    <ReactFlowProvider>
      <div className="h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={{
            trigger: TriggerNode,
            action: ActionNode,
            workflow: WorkflowNode,
            scratch: PlaceHolderNode,
          }}
          edgeTypes={{
            primary: PrimaryEdge,
          }}
          fitView
          colorMode={theme}
          minZoom={0.5}
          nodesDraggable={true}
          elementsSelectable={false}
          nodesConnectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          connectionMode={ConnectionMode.Loose}
        >
          <Background />
          <Controls showInteractive={false} position="bottom-right" />
          <MiniMap />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};
