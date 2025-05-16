import {
  Background,
  Controls,
  MiniMap,
  Node,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import '@xyflow/react/dist/style.css';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

import { useQueryState } from 'erxes-ui/hooks';
import { DnDProvider } from '~/modules/app/components/editor/DnDProvider';
import Header from '~/modules/app/components/editor/Header';
import Sidebar from '~/modules/app/components/editor/Sidebar';
import formSchema, {
  TAutomationProps,
} from '~/modules/app/components/editor/common/formSchema';
import ConnectionLine from '~/modules/app/components/editor/edges/connectionLine';
import PrimaryEdge from '~/modules/app/components/editor/edges/primary';
import ActionNode from '~/modules/app/components/editor/nodes/Action';
import TriggerNode from '~/modules/app/components/editor/nodes/Trigger';
import { IAutomation, NodeData } from '~/modules/app/types';
import { connectionHandler, generateConnect, getNewId } from './common/actions';
import { deepCleanNulls, generateEdges, generateNodes } from './common/utils';

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
      onDisconnect: (edge) => console.log({ nodes, edge, setEdges, onConnect }),
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
        onDisconnect: (edge) =>
          console.log({ nodes, edge, setEdges, onConnect }),
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
    const nodeType = node.data.nodeType;
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

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node<NodeData>) => {
      event.preventDefault();

      const pane = editorWrapper?.current?.getBoundingClientRect();
      if (pane) {
        setMenu({
          id: node.id,
          top: event.clientY < pane.height - 200 && event.clientY,
          left: event.clientX < pane.width - 200 && event.clientX,
          right:
            event.clientX >= pane.width - 200 && pane.width - event.clientX,
          bottom:
            event.clientY >= pane.height - 200 && pane.height - event.clientY,
        } as any);
      }
    },
    [setMenu],
  );
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

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
          // onDoubleClick={(event) => console.log({ event })}
          onNodeDoubleClick={(event, node) => {
            const isCollapsibleTrigger = (event.target as HTMLElement).closest(
              '[data-collapsible-trigger]',
            );
            if (!isCollapsibleTrigger) {
              setValue('activeNode', { ...node.data, id: node.id });
              setValue('isMinimized', false);
              setActiveNodeId(node.id);
            }
          }}
          onInit={setReactFlowInstance}
          onDragOver={onDragOver}
          fitView
          style={{ backgroundColor: '#F7F9FB' }}
          connectionLineComponent={ConnectionLine}
          onNodeDragStop={onNodeDragStop}

          // onNodeContextMenu={onNodeContextMenu}
        >
          {/* {menu && <ContextMenu onClick={onPaneClick} {...menu} />} */}
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

export default ({ detail }: { detail?: IAutomation }) => {
  const [activeNodeId] = useQueryState('activeNodeId');
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const form = useForm<TAutomationProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isMinimized: activeNodeId ? false : true,
      activeTab: 'builder',
      detail: deepCleanNulls(detail),
    },
  });

  return (
    <ReactFlowProvider>
      <DnDProvider>
        <FormProvider {...form}>
          <Header reactFlowInstance={reactFlowInstance} />
          <Editor
            reactFlowInstance={reactFlowInstance}
            setReactFlowInstance={setReactFlowInstance}
          />
        </FormProvider>
      </DnDProvider>
    </ReactFlowProvider>
  );
};
