'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  type Edge,
  type OnConnect,
  type NodeMouseHandler,
  type ReactFlowInstance,
  type NodeProps,
  type OnNodesChange,
  type NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAtom } from 'jotai';
import { useToast } from 'erxes-ui/hooks';
import { TableNode } from './tableNode';
import {
  isFullscreenAtom,
  sidebarViewAtom,
  slotDetailAtom,
  syncSelectedNodeAtom,
} from '../states/slot';
import NodeControls from './nodeControl';
import { cn } from 'erxes-ui/lib';
import { Tabs } from 'erxes-ui/components';
import SidebarList from './sideBar';
import SidebarDetail from './sideBarDetail';
import MiniMapToggle from './miniMap';
import { CustomNode, TableNodeData } from '../types';
import { usePosSlots } from '~/modules/hooks/usePosSlots';
import { DefaultNode } from '~/modules/constants';

interface POSSlotsManagerProps {
  posId: string;
  initialNodes?: CustomNode[];
  onNodesChange?: (nodes: CustomNode[]) => void;
  isCreating?: boolean;
}

const POSSlotsManager = ({
  posId,
  initialNodes = [],
  onNodesChange,
  isCreating = false,
}: POSSlotsManagerProps) => {
  const { toast } = useToast();

  const {
    nodes: hookNodes,
    setNodes: setHookNodes,
    loading: slotsLoading,
    error: slotsError,
    addSlot: hookAddSlot,
    updateSlot: hookUpdateSlot,
    deleteSlot: hookDeleteSlot,
    saveSlots: hookSaveSlots,
    hasSlots,
    refetch,
  } = usePosSlots(posId);

  const initialNodesData = useMemo(() => {
    if (hookNodes.length > 0) {
      return hookNodes;
    }
    if (initialNodes.length > 0) {
      return initialNodes;
    }
    return [DefaultNode];
  }, [hookNodes, initialNodes]);

  const [nodes, setNodes, onNodesChangeInternal] =
    useNodesState<CustomNode>(initialNodesData);

  const initialEdges: Edge[] = [];
  const nodeTypes = { tableNode: TableNode };
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [selectedNode, setSelectedNode] = useAtom(syncSelectedNodeAtom);
  const [slotDetail, setSlotDetail] = useAtom(slotDetailAtom);
  const [sidebarView, setSidebarView] = useAtom(sidebarViewAtom);
  const [isFullscreen, setIsFullscreen] = useAtom(isFullscreenAtom);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState('slots');

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const nodesRef = useRef(nodes);
  const selectedNodeRef = useRef(selectedNode);

  useEffect(() => {
    if (hookNodes.length > 0) {
      setNodes(hookNodes);
    }
  }, [hookNodes, setNodes]);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    selectedNodeRef.current = selectedNode;
  }, [selectedNode]);

  useEffect(() => {
    if (onNodesChange) {
      onNodesChange(nodes);
    }
  }, [nodes, onNodesChange]);

  useEffect(() => {
    if (slotsError) {
      toast({
        title: 'Failed to load slots',
        description: 'There was an error loading the slots data',
        variant: 'destructive',
      });
    }
  }, [slotsError, toast]);

  const generateNextId = useCallback((currentNodes: CustomNode[]): string => {
    if (currentNodes.length === 0) return '1';

    const numericIds = currentNodes
      .map((node) => parseInt(node.id, 10))
      .filter((id) => !isNaN(id));

    if (numericIds.length === 0) return '1';

    return String(Math.max(...numericIds) + 1);
  }, []);

  const saveAllSlots = useCallback(async () => {
    try {
      const success = await hookSaveSlots(posId);
      return success;
    } catch (error) {
      console.error('Failed to save slots:', error);
      return false;
    }
  }, [hookSaveSlots, posId]);

  const syncPositionToSlotDetail = useCallback(
    (nodeId: string, position: { x: number; y: number }) => {
      if (selectedNode && selectedNode.id === nodeId) {
        setSlotDetail((prev) => ({
          ...prev,
          left: String(position.x),
          top: String(position.y),
        }));
      }
    },
    [selectedNode, setSlotDetail],
  );

  const updateNodePosition = useCallback(
    (
      nodeId: string,
      position: { x: number; y: number },
      skipSlotDetailSync = false,
    ) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            const updatedNode = {
              ...node,
              position,
              data: {
                ...node.data,
                positionX: position.x,
                positionY: position.y,
              },
            };
            return updatedNode;
          }
          return node;
        }),
      );

      setHookNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              position,
              data: {
                ...node.data,
                positionX: position.x,
                positionY: position.y,
              },
            };
          }
          return node;
        }),
      );

      if (selectedNode && selectedNode.id === nodeId) {
        const updatedSelectedNode = {
          ...selectedNode,
          position,
          data: {
            ...selectedNode.data,
            positionX: position.x,
            positionY: position.y,
          },
        };

        setSelectedNode(updatedSelectedNode);
      }

      if (!skipSlotDetailSync) {
        syncPositionToSlotDetail(nodeId, position);
      }
    },
    [
      setNodes,
      setHookNodes,
      selectedNode,
      setSelectedNode,
      syncPositionToSlotDetail,
    ],
  );

  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      onNodesChangeInternal(changes as NodeChange<CustomNode>[]);
      changes.forEach((change) => {
        if (
          change.type === 'position' &&
          change.position &&
          change.dragging === false
        ) {
          syncPositionToSlotDetail(change.id, change.position);
        }
      });
    },
    [onNodesChangeInternal, syncPositionToSlotDetail],
  );
  useEffect(() => {
    if (selectedNode && slotDetail.left && slotDetail.top) {
      const formX = Number(slotDetail.left);
      const formY = Number(slotDetail.top);
      const currentX =
        selectedNode.position?.x ?? selectedNode.data.positionX ?? 0;
      const currentY =
        selectedNode.position?.y ?? selectedNode.data.positionY ?? 0;
      if (formX !== currentX || formY !== currentY) {
        updateNodePosition(selectedNode.id, { x: formX, y: formY }, true);
      }
    }
  }, [slotDetail.left, slotDetail.top, selectedNode?.id, updateNodePosition]);

  useEffect(() => {
    const handleNodeResize = (event: Event) => {
      const { detail } = event as CustomEvent;
      if (detail && detail.id) {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === detail.id) {
              const updatedNode = {
                ...node,
                data: {
                  ...node.data,
                  width: detail.width,
                  height: detail.height,
                },
                width: detail.width,
                height: detail.height,
              };

              if (detail.position) {
                updatedNode.position = detail.position;
                updatedNode.data.positionX = detail.position.x;
                updatedNode.data.positionY = detail.position.y;
              }

              return updatedNode;
            }
            return node;
          }),
        );

        setHookNodes((nds) =>
          nds.map((node) => {
            if (node.id === detail.id) {
              const updatedNode = {
                ...node,
                data: {
                  ...node.data,
                  width: detail.width,
                  height: detail.height,
                },
                width: detail.width,
                height: detail.height,
              };

              if (detail.position) {
                updatedNode.position = detail.position;
                updatedNode.data.positionX = detail.position.x;
                updatedNode.data.positionY = detail.position.y;
              }

              return updatedNode;
            }
            return node;
          }),
        );

        if (
          selectedNodeRef.current &&
          selectedNodeRef.current.id === detail.id
        ) {
          const updatedNode = nodesRef.current.find(
            (node) => node.id === detail.id,
          );
          if (updatedNode) {
            const newSelectedNode = {
              ...updatedNode,
              data: {
                ...updatedNode.data,
                width: detail.width,
                height: detail.height,
              },
              width: detail.width,
              height: detail.height,
            } as CustomNode;

            setSelectedNode(newSelectedNode);
            setSlotDetail((prev) => ({
              ...prev,
              width: String(detail.width),
              height: String(detail.height),
              ...(detail.position && {
                left: String(detail.position.x),
                top: String(detail.position.y),
              }),
            }));
          }
        }
      }
    };

    const handleNodePosition = (event: Event) => {
      const { detail } = event as CustomEvent;
      if (detail && detail.id && detail.position) {
        const { x, y } = detail.position;
        updateNodePosition(detail.id, { x, y });
      }
    };

    const handleNodeRotate = (event: Event) => {
      const { detail } = event as CustomEvent;
      if (detail && detail.id) {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === detail.id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  rotateAngle: detail.rotateAngle,
                },
              };
            }
            return node;
          }),
        );
        setHookNodes((nds) =>
          nds.map((node) => {
            if (node.id === detail.id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  rotateAngle: detail.rotateAngle,
                },
              };
            }
            return node;
          }),
        );

        if (
          selectedNodeRef.current &&
          selectedNodeRef.current.id === detail.id
        ) {
          const updatedNode = nodesRef.current.find(
            (node) => node.id === detail.id,
          );
          if (updatedNode) {
            const newSelectedNode = {
              ...updatedNode,
              data: {
                ...updatedNode.data,
                rotateAngle: detail.rotateAngle,
              },
            } as CustomNode;

            setSelectedNode(newSelectedNode);
            setSlotDetail((prev) => ({
              ...prev,
              rotateAngle: String(detail.rotateAngle),
            }));
          }
        }
      }
    };

    const handleNodeEdit = (event: Event) => {
      const { detail } = event as CustomEvent;
      if (detail && detail.id) {
        const node = nodesRef.current.find((n) => n.id === detail.id);
        if (node) {
          setSelectedNode(node as CustomNode);
          setSlotDetail({
            name: node.data.label,
            code: node.data.code,
            rounded: node.data.rounded,
            width: node.data.width.toString(),
            height: node.data.height.toString(),
            top: node.data.positionY.toString(),
            left: node.data.positionX.toString(),
            rotateAngle: node.data.rotateAngle.toString(),
            zIndex: node.data.zIndex.toString(),
            color: node.data.color,
            disabled: node.data.disabled,
            label: node.data.label,
          });
          setSidebarView('detail');
          setActiveTab('details');
        }
      }
    };

    document.addEventListener('node:dimensions-change', handleNodeResize);
    document.addEventListener('node:position', handleNodePosition);
    document.addEventListener('node:rotate', handleNodeRotate);
    document.addEventListener('node:edit', handleNodeEdit);

    return () => {
      document.removeEventListener('node:dimensions-change', handleNodeResize);
      document.removeEventListener('node:position', handleNodePosition);
      document.removeEventListener('node:rotate', handleNodeRotate);
      document.removeEventListener('node:edit', handleNodeEdit);
    };
  }, [
    setNodes,
    setHookNodes,
    setSidebarView,
    setSelectedNode,
    setSlotDetail,
    updateNodePosition,
  ]);

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((eds) =>
        addEdge(
          { ...params, animated: true, style: { stroke: '#5E5CFF' } },
          eds,
        ),
      );
      toast({
        title: 'Connection created',
        description: `Connected ${params.source} to ${params.target}`,
      });
    },
    [setEdges, toast],
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (event, node) => {
      setSelectedNode(node as CustomNode);
      const nodeData = node as CustomNode;
      setSlotDetail({
        name: nodeData.data.label,
        code: nodeData.data.code,
        rounded: nodeData.data.rounded,
        width: nodeData.data.width.toString(),
        height: nodeData.data.height.toString(),
        top: (nodeData.position?.y ?? nodeData.data.positionY ?? 0).toString(),
        left: (nodeData.position?.x ?? nodeData.data.positionX ?? 0).toString(),
        rotateAngle: nodeData.data.rotateAngle.toString(),
        zIndex: nodeData.data.zIndex.toString(),
        color: nodeData.data.color,
        disabled: nodeData.data.disabled,
        label: nodeData.data.label,
      });
      setSidebarView('detail');
      setActiveTab('details');
    },
    [setSelectedNode, setSidebarView, setSlotDetail],
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    if (sidebarView === 'detail') {
      setSidebarView('list');
    }
    setActiveTab('slots');
  }, [sidebarView, setSidebarView, setSelectedNode]);

  const handleAddSlot = useCallback(() => {
    const newNode = hookAddSlot();
    setNodes((nds) => [...nds, newNode]);
    toast({
      title: 'Slot added',
      description: `Added new slot: ${newNode.data.label}`,
    });
  }, [hookAddSlot, setNodes, toast]);

  const handleSaveSlotDetail = useCallback(async () => {
    if (selectedNodeRef.current) {
      const width = Number(slotDetail.width) || 80;
      const height = Number(slotDetail.height) || 80;
      const x = Number(slotDetail.left);
      const y = Number(slotDetail.top);
      const rotateAngle = Number(slotDetail.rotateAngle) || 0;
      const zIndex = Number(slotDetail.zIndex) || 0;

      const updatedNode = {
        ...selectedNodeRef.current,
        position: { x, y },
        width,
        height,
        data: {
          ...selectedNodeRef.current.data,
          label: slotDetail.name || `TABLE ${selectedNodeRef.current.id}`,
          code: slotDetail.code || selectedNodeRef.current.id,
          color: slotDetail.color,
          width,
          height,
          positionX: x,
          positionY: y,
          rounded: slotDetail.rounded,
          rotateAngle,
          zIndex,
          disabled: slotDetail.disabled,
        },
      };

      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNodeRef.current?.id ? updatedNode : node,
        ),
      );
      setHookNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNodeRef.current?.id ? updatedNode : node,
        ),
      );

      try {
        await hookSaveSlots(posId);

        toast({
          title: 'Slot updated and saved',
          description: `Updated slot: ${slotDetail.name}`,
        });

        setSidebarView('list');
        setSelectedNode(null);
        setActiveTab('slots');

        return true;
      } catch (error) {
        console.error('Failed to save slot:', error);
        toast({
          title: 'Slot updated locally',
          description: 'Failed to save to server. Changes are local only.',
          variant: 'destructive',
        });
        throw error;
      }
    }
    return false;
  }, [
    slotDetail,
    setNodes,
    setHookNodes,
    setSidebarView,
    setSelectedNode,
    toast,
    setActiveTab,
    hookSaveSlots,
    posId,
  ]);

  const handleDeleteSlot = useCallback(
    async (id: string) => {
      hookDeleteSlot(id);
      setNodes((nds) => nds.filter((node) => node.id !== id));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== id && edge.target !== id),
      );

      if (selectedNodeRef.current && selectedNodeRef.current.id === id) {
        setSelectedNode(null);
        setSidebarView('list');
        setActiveTab('slots');
      }
      try {
        await hookSaveSlots(posId);
        toast({
          title: 'Slot deleted and saved',
          description: `Deleted slot: ${id}`,
        });
      } catch (error) {
        console.error('Failed to save after deletion:', error);
        toast({
          title: 'Slot deleted locally',
          description: 'Failed to save to server. Changes are local only.',
          variant: 'destructive',
        });
      }
    },
    [
      hookDeleteSlot,
      hookSaveSlots,
      setNodes,
      setEdges,
      setSidebarView,
      setSelectedNode,
      toast,
      setActiveTab,
      posId,
    ],
  );

  const handleDuplicateSlot = useCallback(
    (id: string) => {
      const nodeToDuplicate = nodesRef.current.find((node) => node.id === id);
      if (!nodeToDuplicate) {
        return;
      }

      const newId = generateNextId(nodesRef.current);
      const newPositionX = nodeToDuplicate.position.x + 30;
      const newPositionY = nodeToDuplicate.position.y + 30;

      const newNode: CustomNode = {
        ...nodeToDuplicate,
        id: newId,
        position: {
          x: newPositionX,
          y: newPositionY,
        },
        data: {
          ...nodeToDuplicate.data,
          code: newId,
          label: `${nodeToDuplicate.data.label} (Copy)`,
          positionX: newPositionX,
          positionY: newPositionY,
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setHookNodes((nds) => [...nds, newNode]);
      toast({
        title: 'Slot duplicated',
        description: `Duplicated slot: ${nodeToDuplicate.data.label}`,
      });
    },
    [setNodes, setHookNodes, toast, generateNextId],
  );

  const arrangeNodesInGrid = useCallback(() => {
    const GRID_SPACING_X = 200;
    const GRID_SPACING_Y = 150;
    const COLUMNS = 3;

    const arrangedNodes = nodesRef.current.map((node, index) => {
      const column = index % COLUMNS;
      const row = Math.floor(index / COLUMNS);
      const x = 100 + column * GRID_SPACING_X;
      const y = 100 + row * GRID_SPACING_Y;

      return {
        ...node,
        position: { x, y },
        data: {
          ...node.data,
          positionX: x,
          positionY: y,
        },
      };
    });

    setNodes(arrangedNodes);
    setHookNodes(arrangedNodes);

    toast({
      title: 'Layout arranged',
      description: 'Slots have been arranged in a grid layout',
    });
  }, [setNodes, setHookNodes, toast]);

  const handleNodeSelect = useCallback(
    (nodeId: string) => {
      const node = nodesRef.current.find((n) => n.id === nodeId);
      if (node) {
        setSelectedNode(node as CustomNode);
        setSlotDetail({
          name: node.data.label,
          code: node.data.code,
          rounded: node.data.rounded,
          width: node.data.width.toString(),
          height: node.data.height.toString(),
          top: (node.position?.y ?? node.data.positionY ?? 0).toString(),
          left: (node.position?.x ?? node.data.positionX ?? 0).toString(),
          rotateAngle: node.data.rotateAngle.toString(),
          zIndex: node.data.zIndex.toString(),
          color: node.data.color,
          disabled: node.data.disabled,
          label: node.data.label,
        });
        setSidebarView('detail');
        setActiveTab('details');
      }
    },
    [setSelectedNode, setSidebarView, setActiveTab, setSlotDetail],
  );

  const handleAddNew = useCallback(
    (nodeData?: Partial<TableNodeData>) => {
      const newId = generateNextId(nodesRef.current);
      const newPositionX = 250 + (nodesRef.current.length % 2) * 200;
      const newPositionY = 100 + Math.floor(nodesRef.current.length / 2) * 150;

      const newNode: CustomNode = {
        id: newId,
        type: 'tableNode',
        position: {
          x: newPositionX,
          y: newPositionY,
        },
        data: {
          label: nodeData?.label || `TABLE ${newId}`,
          code: nodeData?.code || newId,
          color: nodeData?.color || '#4F46E5',
          width: nodeData?.width || 80,
          height: nodeData?.height || 80,
          positionX: newPositionX,
          positionY: newPositionY,
          rounded: nodeData?.rounded || false,
          rotateAngle: nodeData?.rotateAngle || 0,
          zIndex: nodeData?.zIndex || 0,
          disabled: nodeData?.disabled || false,
        },
      };
      setNodes((nds) => [...nds, newNode]);
      setHookNodes((nds) => [...nds, newNode]);
      toast({
        title: 'Slot added',
        description: `Added new slot: ${newNode.data.label}`,
      });
    },
    [setNodes, setHookNodes, toast, generateNextId],
  );

  if (slotsLoading && !hasSlots) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-lg text-gray-600 dark:text-gray-300">
          Loading slots...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 flex relative">
        <div className="flex-1 h-full" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={handleNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onInit={setReactFlowInstance}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              fitView
              snapToGrid
              snapGrid={[20, 20]}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
              proOptions={{ hideAttribution: true }}
            >
              <Background variant={undefined} gap={12} size={1} />
              <Controls position="bottom-right" showInteractive={false} />
              <MiniMapToggle
                nodeStrokeWidth={3}
                zoomable
                pannable
                position="top-left"
              />

              <NodeControls
                onAddSlot={handleAddSlot}
                onArrangeNodes={arrangeNodesInGrid}
                isEditMode={false}
                toggleEditMode={() => {}}
                isFullscreen={isFullscreen}
                toggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                selectedNode={selectedNode}
                onSave={handleSaveSlotDetail}
                onDelete={() =>
                  selectedNode && handleDeleteSlot(selectedNode.id)
                }
                onAdd={handleAddNew}
              />
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        {sidebarView !== 'hidden' && (
          <div
            className={cn(
              'w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-200 ease-in-out',
              isDragging ? 'opacity-50' : 'opacity-100',
            )}
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <Tabs.Content value="slots" className="m-0">
                <SidebarList
                  nodes={nodes}
                  selectedNode={selectedNode}
                  onNodeClick={onNodeClick}
                  onAddSlot={handleAddSlot}
                  onDuplicateSlot={handleDuplicateSlot}
                  onDeleteSlot={handleDeleteSlot}
                  onNodeSelect={handleNodeSelect}
                  onAddNew={handleAddNew}
                />
              </Tabs.Content>

              <Tabs.Content value="details" className="m-0">
                {selectedNode && (
                  <SidebarDetail
                    onSave={handleSaveSlotDetail}
                    onCancel={() => {
                      setSidebarView('list');
                      setSelectedNode(null);
                      setActiveTab('slots');
                    }}
                  />
                )}
              </Tabs.Content>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default POSSlotsManager;
