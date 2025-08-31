import PrimaryEdge from '@/automations/components/builder/edges/PrimaryEdge';
import ActionNode from '@/automations/components/builder/nodes/ActionNode';
import { PlaceHolderNode } from '@/automations/components/builder/nodes/PlaceHolderNode';
import TriggerNode from '@/automations/components/builder/nodes/TriggerNode';
import WorkflowNode from '@/automations/components/builder/nodes/WorkflowNode';
import { AUTOMATION_DETAIL } from '@/automations/graphql/automationQueries';
import { AutomationNodeType, IAutomation, NodeData } from '@/automations/types';
import { generateEdges } from '@/automations/utils/automationBuilderUtils/generateEdges';
import {
  generateNode,
  generateNodes,
} from '@/automations/utils/automationBuilderUtils/generateNodes';
import {
  TAutomationBuilderForm,
  TAutomationNodeState,
} from '@/automations/utils/AutomationFormDefinitions';
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
  useReactFlow,
} from '@xyflow/react';
import { Card, Checkbox, Spinner, themeState } from 'erxes-ui';
import { useAtomValue } from 'jotai';
import { useFormContext } from 'react-hook-form';
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

  if (!detail) {
    return 'Not found';
  }

  return (
    <WorkflowActionCanvas
      automationId={detail._id}
      actions={detail.actions || []}
    />
  );
};

const useWorkflowMapperBeforeTitleContent = (
  selectedActionIds: string[],
  onSelectActionWorkflow: (actionId: string, checked: boolean) => void,
) => {
  const beforeTitleContent = (id: string, type: AutomationNodeType) => {
    return (
      <Checkbox
        checked={selectedActionIds.includes(id)}
        onCheckedChange={(checked) =>
          onSelectActionWorkflow(id, Boolean(checked))
        }
        className="data-[state=checked]:border-success data-[state=indeterminate]:border-success data-[state=checked]:bg-success data-[state=indeterminate]:bg-success"
      />
    );
  };

  return { beforeTitleContent };
};

const useActionsWorkflow = (automationId: string) => {
  const { getNodes, setNodes } = useReactFlow<Node<NodeData>>();
  const { getValues, setValue } = useFormContext<TAutomationBuilderForm>();
  const workflows = getValues('workflows') || [];
  const { selectedActionIds = [] } =
    workflows.find((workflow) => workflow?.automationId === automationId)
      ?.config || {};
  const onSelectActionWorkflow = (actionId: string, checked: boolean) => {
    const updateWorkflows = (getValues('workflows') || []).map((workflow) => {
      if (workflow.automationId) {
        let { selectedActionIds = [] } = workflow?.config || {};

        selectedActionIds = !checked
          ? selectedActionIds.filter(
              (selectedActionId: string) => selectedActionId !== actionId,
            )
          : [...selectedActionIds, actionId];

        return {
          ...workflow,
          config: {
            ...workflow.config,
            selectedActionIds,
          },
        };
      }
      return workflow;
    });

    const updatedNodes = updateWorkflows.map((workflow) =>
      generateNode(
        workflow as Extract<
          TAutomationNodeState,
          { nodeType: AutomationNodeType.Workflow }
        >,
        AutomationNodeType.Workflow,
        updateWorkflows || [],
        {},
        getNodes(),
      ),
    );

    setNodes((nodes) =>
      nodes.map((node) => {
        const updated = updatedNodes.find((n) => n.id === node.id);
        return updated ? updated : node;
      }),
    );

    setValue('workflows', updateWorkflows);
  };

  return {
    selectedActionIds,
    onSelectActionWorkflow,
  };
};
const WorkflowActionCanvas = ({
  automationId,
  actions,
}: {
  automationId: string;
  actions: IAction[];
}) => {
  const theme = useAtomValue(themeState);
  const { onSelectActionWorkflow, selectedActionIds } =
    useActionsWorkflow(automationId);

  const { beforeTitleContent } = useWorkflowMapperBeforeTitleContent(
    selectedActionIds,
    onSelectActionWorkflow,
  );

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
          <Controls position="bottom-left" />
          <MiniMap position="top-left" />
        </ReactFlow>
        {selectedActionIds?.length > 0 && (
          <Card className="absolute bottom-4 border-2 border-dashed border-success text-muted-foreground text-center right-4 p-2 w-64 bg-background">
            <Card.Title>
              {selectedActionIds?.length} action
              {selectedActionIds?.length > 1 ? 's' : ''} selected
            </Card.Title>
          </Card>
        )}
      </div>
    </ReactFlowProvider>
  );
};
