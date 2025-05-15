"use client"

import { useState, useCallback, useRef, useEffect } from "react"
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
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useAtom } from "jotai"
import { useToast } from "erxes-ui/hooks"
import { CustomNode } from "../types/resize"
import { TableNode } from "./tableNode"
import { isFullscreenAtom, sidebarViewAtom, slotDetailAtom, syncSelectedNodeAtom } from "../states/slot"
import NodeControls from "./nodeControl"
import { cn } from "erxes-ui/lib"
import { Tabs } from "erxes-ui/components"
import SidebarList from "./sideBar"
import SidebarDetail from "./sideBarDetail"
import MiniMapToggle from "./miniMap"
import { TableNodeData } from "../types"

const POSSlotsManager = () => {
  const { toast } = useToast()

  const initialNodes: CustomNode[] = [
    {
      id: "1",
      type: "tableNode",
      position: { x: 250, y: 100 },
      data: {
        label: "TABLE 1",
        code: "1",
        color: "#4F46E5",
        width: 80,
        height: 80,
        positionX: 250,
        positionY: 100,
        rounded: false,
        rotateAngle: 0,
        zIndex: 0,
        disabled: false,
      },
    },
  ]

  const initialEdges: Edge[] = []

  const nodeTypes = { tableNode: TableNode }

  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const [selectedNode, setSelectedNode] = useAtom(syncSelectedNodeAtom)
  const [slotDetail, setSlotDetail] = useAtom(slotDetailAtom)
  const [sidebarView, setSidebarView] = useAtom(sidebarViewAtom)
  const [isFullscreen, setIsFullscreen] = useAtom(isFullscreenAtom)
  const [isDragging, setIsDragging] = useState(false)
  const [activeTab, setActiveTab] = useState("slots")

  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)

  useEffect(() => {
    const handleNodeResize = (event: Event) => {
      const detail = (event as CustomEvent).detail
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
              }

              if (detail.position) {
                updatedNode.position = detail.position
                updatedNode.data.positionX = detail.position.x
                updatedNode.data.positionY = detail.position.y
              }

              return updatedNode
            }
            return node
          }),
        )

        if (selectedNode && selectedNode.id === detail.id) {
          const updatedNode = nodes.find((node) => node.id === detail.id)
          if (updatedNode) {
            setSelectedNode({
              ...updatedNode,
              data: {
                ...updatedNode.data,
                width: detail.width,
                height: detail.height,
              },
              width: detail.width,
              height: detail.height,
            } as CustomNode)
          }
        }
      }
    }

    const handleNodePosition = (event: Event) => {
      const detail = (event as CustomEvent).detail
      if (detail && detail.id && detail.position) {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === detail.id) {
              return {
                ...node,
                position: detail.position,
                data: {
                  ...node.data,
                  positionX: detail.position.x,
                  positionY: detail.position.y,
                },
              }
            }
            return node
          }),
        )

        if (selectedNode && selectedNode.id === detail.id) {
          const updatedNode = nodes.find((node) => node.id === detail.id)
          if (updatedNode) {
            setSelectedNode({
              ...updatedNode,
              position: detail.position,
              data: {
                ...updatedNode.data,
                positionX: detail.position.x,
                positionY: detail.position.y,
              },
            } as CustomNode)
          }
        }
      }
    }

    const handleNodeRotate = (event: Event) => {
      const detail = (event as CustomEvent).detail
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
              }
            }
            return node
          }),
        )

        if (selectedNode && selectedNode.id === detail.id) {
          const updatedNode = nodes.find((node) => node.id === detail.id)
          if (updatedNode) {
            setSelectedNode({
              ...updatedNode,
              data: {
                ...updatedNode.data,
                rotateAngle: detail.rotateAngle,
              },
            } as CustomNode)
          }
        }
      }
    }

    const handleNodeEdit = (event: Event) => {
      const detail = (event as CustomEvent).detail
      if (detail && detail.id) {
        const node = nodes.find((n) => n.id === detail.id)
        if (node) {
          setSelectedNode(node as CustomNode)
          setSidebarView("detail")
          setActiveTab("details")
        }
      }
    }

    document.addEventListener("node:dimensions-change", handleNodeResize)
    document.addEventListener("node:position", handleNodePosition)
    document.addEventListener("node:rotate", handleNodeRotate)
    document.addEventListener("node:edit", handleNodeEdit)

    return () => {
      document.removeEventListener("node:dimensions-change", handleNodeResize)
      document.removeEventListener("node:position", handleNodePosition)
      document.removeEventListener("node:rotate", handleNodeRotate)
      document.removeEventListener("node:edit", handleNodeEdit)
    }
  }, [nodes, selectedNode, setNodes, setSidebarView, setSelectedNode])

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "#5E5CFF" } }, eds))
      toast({
        title: "Connection created",
        description: `Connected ${params.source} to ${params.target}`,
      })
    },
    [setEdges, toast],
  )

  const onNodeClick: NodeMouseHandler = useCallback(
    (event, node) => {
      setSelectedNode(node as CustomNode)
      setSidebarView("detail")
      setActiveTab("details")
    },
    [setSelectedNode, setSidebarView],
  )

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    if (sidebarView === "detail") {
      setSidebarView("list")
    }
    setActiveTab("slots")
  }, [sidebarView, setSidebarView, setSelectedNode])

  const handleAddSlot = () => {
    const newId = String(nodes.length + 1)
    const newPositionX = 250 + (nodes.length % 2) * 200
    const newPositionY = 100 + Math.floor(nodes.length / 2) * 150

    const newNode: CustomNode = {
      id: newId,
      type: "tableNode",
      position: {
        x: newPositionX,
        y: newPositionY,
      },
      data: {
        label: `TABLE ${newId}`,
        code: newId,
        color: "#4F46E5",
        width: 80,
        height: 80,
        positionX: newPositionX,
        positionY: newPositionY,
        rounded: false,
        rotateAngle: 0,
        zIndex: 0,
        disabled: false,
      },
    }
    setNodes((nds) => [...nds, newNode])
    toast({
      title: "Slot added",
      description: `Added new slot: TABLE ${newId}`,
    })
  }

  const handleSaveSlotDetail = () => {
    if (selectedNode) {
      const width = Number.parseInt(slotDetail.width, 10) || 80
      const height = Number.parseInt(slotDetail.height, 10) || 80
      const x = Number.parseInt(slotDetail.left, 10) || 0
      const y = Number.parseInt(slotDetail.top, 10) || 0
      const rotateAngle = Number.parseInt(slotDetail.rotateAngle, 10) || 0
      const zIndex = Number.parseInt(slotDetail.zIndex, 10) || 0

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              position: { x, y },
              width,
              height,
              data: {
                ...node.data,
                label: slotDetail.name || `TABLE ${node.id}`,
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
            }
          }
          return node
        }),
      )
      setSidebarView("list")
      setSelectedNode(null)
      setActiveTab("slots")
      toast({
        title: "Slot updated",
        description: `Updated slot: ${slotDetail.name}`,
      })
    }
  }

  const handleDeleteSlot = (id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id))
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id))
    if (selectedNode && selectedNode.id === id) {
      setSelectedNode(null)
      setSidebarView("list")
      setActiveTab("slots")
    }
    toast({
      title: "Slot deleted",
      description: `Deleted slot: ${id}`,
    })
  }

  const handleDuplicateSlot = (id: string) => {
    const nodeToDuplicate = nodes.find((node) => node.id === id)
    if (!nodeToDuplicate) return

    const newId = String(Math.max(...nodes.map((n) => Number.parseInt(n.id, 10)), 0) + 1)

    const newPositionX = nodeToDuplicate.position.x + 30
    const newPositionY = nodeToDuplicate.position.y + 30

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
    }

    setNodes((nds) => [...nds, newNode])
    toast({
      title: "Slot duplicated",
      description: `Duplicated slot: ${nodeToDuplicate.data.label}`,
    })
  }

  const arrangeNodesInGrid = () => {
    const GRID_SPACING_X = 200
    const GRID_SPACING_Y = 150
    const COLUMNS = 3

    setNodes((nds) =>
      nds.map((node, index) => {
        const column = index % COLUMNS
        const row = Math.floor(index / COLUMNS)
        const x = 100 + column * GRID_SPACING_X
        const y = 100 + row * GRID_SPACING_Y

        return {
          ...node,
          position: { x, y },
          data: {
            ...node.data,
            positionX: x,
            positionY: y,
          },
        }
      }),
    )

    toast({
      title: "Layout arranged",
      description: "Slots have been arranged in a grid layout",
    })
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 flex relative">
        <div className="flex-1 h-full" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onInit={setReactFlowInstance as any}
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
              <MiniMapToggle nodeStrokeWidth={3} zoomable pannable position="top-left" />

              <NodeControls
                onAddSlot={handleAddSlot}
                onArrangeNodes={arrangeNodesInGrid}
                isEditMode={false}
                toggleEditMode={() => {}}
                isFullscreen={isFullscreen}
                toggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                selectedNode={selectedNode}
                onSave={handleSaveSlotDetail}
                onDelete={handleDeleteSlot}
              />
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        {sidebarView !== "hidden" && (
          <div
            className={cn(
              "w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-200 ease-in-out",
              isDragging ? "opacity-50" : "opacity-100",
            )}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <Tabs.Content value="slots" className="m-0">
                <SidebarList
                  nodes={nodes}
                  selectedNode={selectedNode}
                  onNodeClick={onNodeClick}
                  onAddSlot={handleAddSlot}
                  onDuplicateSlot={handleDuplicateSlot}
                  onDeleteSlot={handleDeleteSlot} onNodeSelect={function (nodeId: string): void {
                    throw new Error("Function not implemented.")
                  } } onAddNew={function (nodeData?: Partial<TableNodeData>): void {
                    throw new Error("Function not implemented.")
                  } }                />
              </Tabs.Content>

              <Tabs.Content value="details" className="m-0">
                {selectedNode && (
                  <SidebarDetail
                    onSave={handleSaveSlotDetail}
                    onCancel={() => {
                      setSidebarView("list")
                      setSelectedNode(null)
                      setActiveTab("slots")
                    }}
                  />
                )}
              </Tabs.Content>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}

export default POSSlotsManager
