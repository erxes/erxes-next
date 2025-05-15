import { Node, NodeProps } from "@xyflow/react";

export type SidebarViewType = "list" | "detail" | "hidden";

export interface CustomNodeData {
  label: string;
  code: string;
  color: string;
  width: number;
  height: number;
  rounded: boolean;
  rotateAngle: number;
  zIndex: number;
  disabled: boolean;
  [key: string]: unknown;
}

export interface SlotDetailForm {
  name: string;
  code: string;
  rounded: boolean;
  width: string;
  height: string;
  top: string;
  left: string;
  rotateAngle: string;
  zIndex: string;
  color: string;
  disabled: boolean;
  label:string
}

export interface CustomNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    code: string;
    color: string;
    width: number;
    height: number;
    positionX: number;
    positionY: number;
    rounded: boolean;
    rotateAngle: number;
    zIndex: number;
    disabled: boolean;
  };
  width?: number;
  height?: number;
}

export interface NodeRotateEvent extends Event {
  detail: {
    id: string;
    rotateAngle: number;
  };
}

export interface TableNodeProps extends NodeProps {
  data: CustomNodeData;
  id: string;
}

export interface SlotDetailForm {
  name: string;
  code: string;
  rounded: boolean;
  width: string;
  height: string;
  top: string;
  left: string;
  rotateAngle: string;
  zIndex: string;
  color: string;
  disabled: boolean;
}

export interface NodeResizeEvent extends Event {
  detail: {
    id: string;
    width: number;
    height: number;
  };
}

export interface NodeEditEvent extends Event {
  detail: {
    id: string;
  };
}