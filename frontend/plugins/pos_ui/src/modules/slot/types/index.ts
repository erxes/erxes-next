import { Node, Edge } from '@xyflow/react';

export interface TableNodeData {
  label: string;
  color: string;
  width: number;
  height: number;
  positionX?: number; 
  positionY?: number;
  rounded: boolean;
  rotateAngle: number;
  zIndex: number;
  disabled: boolean;
}

export interface SlotDetailForm {
  name: string;
  code: string;
  rounded: boolean;
  width: number;
  height: number;
  top: string;
  left: string;
  rotateAngle: number;
  zIndex: string;
  color: string;
  disabled: boolean;
  label: string
}

export interface TableNodeProps {
  id: string;
  data: TableNodeData;
  selected: boolean;
}
export interface ResizeEventDetail {
  id: string;
  width: number;
  height: number;
}

export interface NodeResizeEvent extends CustomEvent {
  detail: ResizeEventDetail;
}
// Type for our custom node
export type CustomNode = Node<Record<string, unknown>>;

// Type for tab values
export type TabValue = 'slots' | 'details';

// Type for sidebar view options
export type SidebarViewType = 'list' | 'detail' | 'hidden';

export interface SidebarListProps {
    nodes: CustomNode[];
    onNodeSelect: (nodeId: string) => void;
    onAddNew: (nodeData?: Partial<TableNodeData>) => void;
  }

  export interface UseKeyboardShortcutsProps {
    selectedNode: CustomNode | null;
    setSelectedNode: React.Dispatch<React.SetStateAction<CustomNode | null>>;
    isEditMode: boolean;
    setNodes: React.Dispatch<React.SetStateAction<CustomNode[]>>; // Added this
    sidebarView: SidebarViewType; // Add correct type
    onDeleteNode: () => void;
    onSaveNode: () => void;
    onAddNode: () => void;
    onToggleSidebar: () => void;
  }
  export interface NodeControlsProps {
    isEditMode: boolean;
    toggleEditMode: () => void;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    selectedNode: CustomNode | null;
    onSave: () => void;
    onAdd: (nodeData?: Partial<TableNodeData>) => void;
    onDelete: (() => void) | undefined;
    onAddSlot: () => void;
    onArrangeNodes: () => void;
  }

  