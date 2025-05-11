import React, { useRef, useCallback, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
  MarkerType,
  Edge,
  Node,
  MiniMap,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import Sidebar from './Sidebar';
import { DnDProvider, useDnD } from './DnDProvider';
import TriggerNode from './nodes/Trigger';
import ActionNode from './nodes/Action';
import { Breadcrumb, Button, Separator, Sheet } from 'erxes-ui/components';
import { gql, useQuery } from '@apollo/client';
import queries from '../../graphql/queries';
import {
  AutomationConstants,
  ConstantsQueryResponse,
  NodeData,
} from '../../types';
import Header from './Header';
import { Form, FormProvider, useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IconJumpRope, IconDeviceFloppy, IconMenu } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { PageHeader } from 'erxes-ui/modules';
import ConnectionLine from './edges/connectionLine';
import PrimaryEdge from './edges/primary';
import ContextMenu from './nodes/ContextMenu';
const initialNodes: Node<any>[] = [
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 100, y: 150 },
    data: {
      label: 'New Customer Created',
      nodeType: 'trigger',
      module: 'customers',
      description: 'Triggered when a new customer is created in the CRM',
      configurable: true,
      config: {
        event: 'created',
        source: 'any',
      },
    },
  },
  {
    id: 'action-1',
    type: 'action',
    position: { x: 450, y: 150 },
    data: {
      label: 'Send Welcome Email',
      nodeType: 'action',
      module: 'messaging',
      description: 'Sends a welcome email to the new customer',
      configurable: true,
      config: {
        template: 'welcome',
        subject: 'Welcome to our platform!',
      },
    },
  },
  {
    id: 'action-2',
    type: 'action',
    position: { x: 800, y: 150 },
    data: {
      label: 'Create Task for Follow-up',
      nodeType: 'action',
      module: 'tasks',
      description: 'Creates a follow-up task assigned to the sales team',
      configurable: true,
      config: {
        title: 'Follow up with new customer',
        assignee: 'sales_team',
        due_date: '+3 days',
      },
    },
  },
];

// Initial edges
const initialEdges: Edge[] = [
  {
    id: 'e-trigger-1-action-1',
    source: 'trigger-1',
    target: 'action-1',
    type: 'primary',
    animated: true,
    style: { stroke: '#64748b', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#64748b',
    },
  },
  {
    id: 'e-action-1-action-2',
    source: 'action-1',
    target: 'action-2',
    type: 'primary',
    animated: true,
    style: { stroke: '#64748b', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#64748b',
    },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;
const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};
const edgeTypes = {
  primary: PrimaryEdge,
};
const DnDFlow = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { watch, setValue } = useFormContext();
  const isMinimized = watch('isMinimized');
  const [nodes, setNodes, onNodesChange] = useNodesState<any>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [activeNodeContextMenu, setActiveNodeContextMenu] = useState<
    any | null
  >(null);

  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const onConnect = useCallback(
    (params: any) => setEdges((eds: any) => addEdge(params, eds)),
    [],
  );
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData('application/reactflow/type');
      const nodeModule = event.dataTransfer.getData(
        'application/reactflow/module',
      );
      const nodeLabel = event.dataTransfer.getData(
        'application/reactflow/label',
      );
      const nodeDescription = event.dataTransfer.getData(
        'application/reactflow/description',
      );

      // Check if the dropped element is valid
      if (typeof nodeType === 'undefined' || !nodeType) {
        return;
      }

      // Get canvas position for the new node
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Create a new node
      const newNode: Node<NodeData> = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: {
          label: nodeLabel || `New ${nodeType}`,
          nodeType: nodeType as 'trigger' | 'action',
          module: nodeModule,
          description: nodeDescription || '',
          configurable: true,
          config: {},
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const onNodeContextMenu = useCallback(
    (event: any, node: any) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      if (reactFlowWrapper.current) {
        const pane = reactFlowWrapper.current.getBoundingClientRect();

        setActiveNodeContextMenu({
          id: node.id,
          top: event.clientY,
          left: event.clientX,
          right:
            event.clientX >= pane.width - 200
              ? pane.width - event.clientX
              : undefined,
          bottom:
            event.clientY >= pane.height - 200
              ? pane.height - event.clientY
              : undefined,
        });
      }
    },
    [setActiveNodeContextMenu],
  );
  const onPaneClick = useCallback(
    () => setActiveNodeContextMenu(null),
    [setActiveNodeContextMenu],
  );
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
  return (
    <div className="flex flex-column grow h-full relative">
      <div className="flex-grow h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          // onDoubleClick={(event) => console.log({ event })}
          // onNodeDoubleClick={(event, node) => setActiveNode(node.data)}
          onInit={setReactFlowInstance}
          onDragOver={onDragOver}
          fitView
          style={{ backgroundColor: '#F7F9FB' }}
          connectionLineComponent={ConnectionLine}
          // onNodeContextMenu={onNodeContextMenu}
          onPaneClick={onPaneClick}
        >
          {/* {activeNodeContextMenu && (
            <ContextMenu onClick={onPaneClick} {...activeNodeContextMenu} />
          )} */}
          <Controls />
          <Background />
          <MiniMap pannable position="top-left" />

          {/* <Sheet
            open={!!activeNode}
            onOpenChange={(open) => {
              if (!open) {
                setActiveNode(null);
              }
            }}
          >
            <Sheet.Content>
              <Sheet.Title>{(activeNode as any)?.label}</Sheet.Title>
              config
            </Sheet.Content>
          </Sheet> */}
        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  );
};

export default () => {
  const form = useForm({
    resolver: zodResolver(
      z.object({
        isMinimized: z.boolean(),
        name: z.string().min(1),
        activeTab: z.string().min(1),
      }),
    ),
    defaultValues: {
      isMinimized: true,
      name: '',
      activeTab: 'builder',
    },
  });

  return (
    <ReactFlowProvider>
      <DnDProvider>
        <FormProvider {...form}>
          {/* <PageHeader>
            <PageHeader.Start>
              <Breadcrumb>
                <Breadcrumb.List className="gap-1">
                  <Breadcrumb.Item>
                    <Button variant="ghost" asChild>
                      <Link to="/automations">
                        <IconJumpRope />
                        Automations
                      </Link>
                    </Button>
                  </Breadcrumb.Item>
                </Breadcrumb.List>
              </Breadcrumb>
              <Separator.Inline />
              <PageHeader.LikeButton />
            </PageHeader.Start>
            <PageHeader.End>
              <Button>
                <IconDeviceFloppy />
                Save
              </Button>
            </PageHeader.End>
          </PageHeader> */}
          <Header />
          <DnDFlow />
        </FormProvider>
      </DnDProvider>
    </ReactFlowProvider>
  );
};
