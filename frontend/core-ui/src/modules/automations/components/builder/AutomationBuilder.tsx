import {
  Background,
  Controls,
  MiniMap,
  Node,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  getOutgoers,
  useEdgesState,
  useNodesState,
  useReactFlow,
  Connection,
  Edge,
} from '@xyflow/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import '@xyflow/react/dist/style.css';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

import { useQueryState } from 'erxes-ui/hooks';
import { AutomationBuilderDnDProvider } from './AutomationBuilderDnDProvider';
import AutomationBuilderHeader from './AutomationBuilderHeader';
import AutomationBuilderSidebar from './AutomationBuilderSidebar';

import ConnectionLine from './edges/connectionLine';
import PrimaryEdge from './edges/primary';
import ActionNode from './nodes/Action';
import TriggerNode from './nodes/Trigger';
import { IAutomation, NodeData } from '../../types';
import {
  connectionHandler,
  generateConnect,
  getNewId,
} from '../../utils/automationActionConnectionUtils';
import {
  deepCleanNulls,
  generateEdges,
  generateNodes,
} from '../../utils/automationBuilderUtils';
import {
  automationBuilderFormSchema,
  TAutomationProps,
} from '@/automations/utils/AutomationFormDefinitions';

interface MenuState {
  id: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

const nodeTypes = {
  trigger: TriggerNode as any,
  action: ActionNode as any,
};
const edgeTypes = {
  primary: PrimaryEdge,
};
const Editor = ({ reactFlowInstance, setReactFlowInstance }: any) => {
  const [activeNodeId, setActiveNodeId] = useQueryState('activeNodeId');
  const edgeUpdateSuccessful = useRef(true);

  const { watch, setValue } = useFormContext<TAutomationProps>();

  const { triggers = [], actions = [] } = watch('detail') || {};

  const [nodes, setNodes, onNodesChange] = useNodesState<any>(
    generateNodes({ triggers, actions }, {}),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>(
    generateEdges({
      triggers,
      actions,
      workFlowActions: [],
    }),
  );

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const editorWrapper = useRef<HTMLDivElement>(null);

  const [menu, setMenu] = useState<MenuState | null>(null);

  const resetNodes = () => {
    const updatedNodes: any[] = generateNodes(
      { triggers, actions, workFlowActions: [] },
      {},
    );

    const mergedArray = updatedNodes.map((node1) => {
      let node2 = nodes.find((o) => o.id === node1.id);

      if (node2) {
        return {
          ...node1,
          data: { ...node2.data, ...node1.data },
          position: { ...node1.position, ...node2.position },
        };
      }
      return node1;
    });
    setNodes(mergedArray);
    setEdges(
      generateEdges({
        triggers,
        actions,
        workFlowActions: [],
      }),
    );
  };

  useEffect(() => {
    resetNodes();
  }, [JSON.stringify(triggers), JSON.stringify(actions)]);

  const { screenToFlowPosition } = useReactFlow();
  // const [type] = useDnD();

  const onConnection = (info: any) => {
    connectionHandler(triggers, actions, info, info.targetId, []);
  };

  const onConnect = useCallback(
    (params: any) => {
      const source = nodes.find((node) => node.id === params.source);
      setEdges((eds) => {
        const updatedEdges = addEdge({ ...params }, eds);

        onConnection(generateConnect(params, source));

        return updatedEdges;
      });
    },
    [nodes],
  );
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData(
        'application/reactflow/type',
      ) as 'trigger' | 'action';
      const nodeModule = event.dataTransfer.getData(
        'application/reactflow/module',
      );
      const nodeLabel = event.dataTransfer.getData(
        'application/reactflow/label',
      );
      const nodeDescription = event.dataTransfer.getData(
        'application/reactflow/description',
      );
      const nodeIcon = event.dataTransfer.getData('application/reactflow/icon');

      // Check if the dropped element is valid
      if (typeof nodeType === 'undefined' || !nodeType) {
        return;
      }

      // Get canvas position for the new node
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const fieldName:
        | `detail.triggers`
        | `detail.actions` = `detail.${nodeType}s`;
      const nodes = watch(fieldName) || [];

      const id = getNewId(actions.map((a) => a.id));
      // Create a new node
      const newNode: Node<NodeData> = {
        id,
        type: nodeType,
        position,
        data: {
          id,
          label: nodeLabel || `New ${nodeType}`,
          icon: nodeIcon,
          nodeType: nodeType as 'trigger' | 'action',
          type: nodeModule,
          description: nodeDescription || '',
          config: {},
          nodeIndex: nodes.length + 1,
          ...(nodeType === 'action' ? {} : { actionId: undefined }),
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setValue(fieldName, [
        ...nodes,
        {
          id,
          type: nodeModule,
          config: {},
          icon: nodeIcon,
          label: nodeLabel,
          description: nodeDescription,
        },
      ]);
    },
    [reactFlowInstance, setNodes],
  );

  const onDisconnection = ({
    nodes,
    edge,
    setEdges,
  }: {
    nodes: Node<NodeData>[];
    edge: any;
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  }) => {
    setEdges((eds: Edge[]) => eds.filter((e) => e.id !== edge.id));
    let info: any = { source: edge.source, target: undefined };

    const sourceNode = nodes.find((n) => n.id === edge.source);

    if (edge.sourceHandle.includes(sourceNode?.id || '')) {
      const [_action, _sourceId, optionalConnectId] = (edge.id || '').split(
        '-',
      );
      info.optionalConnectId = optionalConnectId;
      info.connectType = 'optional';
    }

    onConnection(info);
  };
  // Handle drag start from sidebar
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
    nodeModule: string,
    nodeLabel: string,
    nodeDescription: string,
  ) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/module', nodeModule);
    event.dataTransfer.setData('application/reactflow/label', nodeLabel);
    event.dataTransfer.setData(
      'application/reactflow/description',
      nodeDescription,
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  const onNodeDragStop = (_: any, node: Node<NodeData>) => {
    const nodeType = node.data.nodeType as 'trigger' | 'action';
    const names = {
      trigger: 'triggers',
      action: 'actions',
    };
    const name = names[nodeType] as 'triggers' | 'actions';
    const list = watch('detail')[name];

    setValue(
      `detail.${name}`,
      list.map((item) =>
        item.id === node.id ? { ...item, position: node.position } : item,
      ),
    );
  };

  const isValidConnection = useCallback(
    (connection: Connection) => {
      const target = nodes.find((node) => node.id === connection.target);
      const hasCycle = (node: Node<NodeData>, visited = new Set()) => {
        if (node?.data?.nodeType === 'trigger') return true;
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      if (target?.parentId && connection?.source && target.id) {
      }

      return !hasCycle(target);
    },
    [nodes, edges],
  );
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  const onEdgeUpdateEnd = useCallback((_: any, edge: Edge) => {
    if (!edgeUpdateSuccessful.current) {
      onDisconnection({ nodes, edge, setEdges });
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  const onNodeDoubleClick = (event: any, node: Node<NodeData>) => {
    const isCollapsibleTrigger = (event.target as HTMLElement).closest(
      '[data-collapsible-trigger]',
    );
    if (!isCollapsibleTrigger) {
      setValue('activeNode', { ...node.data, id: node.id });
      setValue('isMinimized', false);
      setActiveNodeId(node.id);
    }
  };

  return (
    <div className="flex flex-column grow h-full relative">
      <div className="flex-grow h-full" ref={reactFlowWrapper}>
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
          // onEdgeUpdate={onEdgeUpdate}
        >
          <Controls />
          <Background />
          <MiniMap pannable position="top-left" />
        </ReactFlow>
      </div>
      <AutomationBuilderSidebar />
    </div>
  );
};

export default ({ detail }: { detail?: IAutomation }) => {
  const [activeNodeId] = useQueryState('activeNodeId');
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const form = useForm<TAutomationProps>({
    resolver: zodResolver(automationBuilderFormSchema),
    defaultValues: {
      isMinimized: activeNodeId ? false : true,
      activeTab: 'builder',
      detail: deepCleanNulls(detail),
    },
  });

  return (
    <ReactFlowProvider>
      <AutomationBuilderDnDProvider>
        <FormProvider {...form}>
          <AutomationBuilderHeader reactFlowInstance={reactFlowInstance} />
          <Editor
            reactFlowInstance={reactFlowInstance}
            setReactFlowInstance={setReactFlowInstance}
          />
        </FormProvider>
      </AutomationBuilderDnDProvider>
    </ReactFlowProvider>
  );
};
