import { useEffect } from 'react';
import { CustomNode, NodeEditEvent, NodeResizeEvent, NodeRotateEvent, SidebarViewType, SlotDetailForm } from '../types/resize';

interface UseNodeResizeProps {
  selectedNode: CustomNode | null;
  setNodes: React.Dispatch<React.SetStateAction<CustomNode[]>>;
  updateSlotDetail?: (updates: Partial<SlotDetailForm>) => void;
}

export const useNodeResize = ({
  selectedNode,
  setNodes,
  updateSlotDetail
}: UseNodeResizeProps) => {
  useEffect(() => {
    const handleNodeResize = (event: Event) => {
      const { id, width, height } = (event as NodeResizeEvent).detail;
      
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                width,
                height,
              },
            };
          }
          return node;
        }),
      );
      
      // Update form if the selected node is being resized
      if (selectedNode && selectedNode.id === id && updateSlotDetail) {
        updateSlotDetail({
          width: String(Math.round(width)),
          height: String(Math.round(height)),
        });
      }
    };
    
    document.addEventListener("node:resize" as keyof ElementEventMap, handleNodeResize as EventListener);
    return () => {
      document.removeEventListener("node:resize" as keyof ElementEventMap, handleNodeResize as EventListener);
    };
  }, [selectedNode, setNodes, updateSlotDetail]);

  // Handle rotation events
  useEffect(() => {
    const handleNodeRotate = (event: Event) => {
      const { id, rotateAngle } = (event as NodeRotateEvent).detail;
      
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                rotateAngle,
              },
            };
          }
          return node;
        }),
      );
      
      // Update form if the selected node is being rotated
      if (selectedNode && selectedNode.id === id && updateSlotDetail) {
        updateSlotDetail({
          rotateAngle: String(Math.round(rotateAngle)),
        });
      }
    };
    
    document.addEventListener("node:rotate" as keyof ElementEventMap, handleNodeRotate as EventListener);
    return () => {
      document.removeEventListener("node:rotate" as keyof ElementEventMap, handleNodeRotate as EventListener);
    };
  }, [selectedNode, setNodes, updateSlotDetail]);
};

interface UseNodeEditProps {
  setSelectedNode: React.Dispatch<React.SetStateAction<CustomNode | null>>;
  setSidebarView: (view: SidebarViewType) => void;
  nodes: CustomNode[];
  setActiveTab: (tab: string) => void;
  setSlotDetail: React.Dispatch<React.SetStateAction<SlotDetailForm>>;
}

export const useNodeEdit = ({
  setSelectedNode,
  setSidebarView,
  nodes,
  setActiveTab,
  setSlotDetail
}: UseNodeEditProps) => {
  useEffect(() => {
    const handleNodeEdit = (event: Event) => {
      const { id } = (event as NodeEditEvent).detail;
      
      const nodeToEdit = nodes.find(node => node.id === id);
      if (!nodeToEdit) return;
      
      setSelectedNode(nodeToEdit);
      setSidebarView("detail");
      setActiveTab("details");
      
      setSlotDetail({
        name: nodeToEdit.data.label,
        code: nodeToEdit.id,
        rounded: nodeToEdit.data.rounded || false,
        width: String(nodeToEdit.data.width || 80),
        height: String(nodeToEdit.data.height || 80),
        top: String(Math.round(nodeToEdit.position.y)),
        left: String(Math.round(nodeToEdit.position.x)),
        rotateAngle: String(nodeToEdit.data.rotateAngle || 0),
        zIndex: String(nodeToEdit.data.zIndex || 0),
        color: nodeToEdit.data.color || "#5E5CFF",
        disabled: nodeToEdit.data.disabled || false,
      });
    };
    
    document.addEventListener("node:edit" as keyof ElementEventMap, handleNodeEdit as EventListener);
    return () => {
      document.removeEventListener("node:edit" as keyof ElementEventMap, handleNodeEdit as EventListener);
    };
  }, [nodes, setSelectedNode, setSidebarView, setActiveTab, setSlotDetail]);
};

export default useNodeResize;