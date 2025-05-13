import { atom } from "jotai";
import { CustomNode, SlotDetailForm } from "../types/resize";

// Atom for the selected node
export const selectedNodeAtom = atom<CustomNode | null>(null);

// Atom for the slot detail form
export const slotDetailAtom = atom<SlotDetailForm>({
  name: "",
  code: "",
  rounded: false,
  width: "80",
  height: "80",
  top: "0",
  left: "0",
  rotateAngle: "0",
  zIndex: "0",
  color: "#5E5CFF",
  disabled: false,
});

// Atom for the sidebar view
export const sidebarViewAtom = atom<"list" | "detail" | "hidden">("list");

// Atom for fullscreen mode
export const isFullscreenAtom = atom<boolean>(false);

// Derived atom that updates the slot detail form when the selected node changes
export const syncSelectedNodeAtom = atom(
  (get) => get(selectedNodeAtom),
  (get, set, node: CustomNode | null) => {
    set(selectedNodeAtom, node);
    
    if (node) {
      set(slotDetailAtom, {
        name: node.data.label,
        code: node.id,
        rounded: node.data.rounded || false,
        width: node.data.width ? String(node.data.width) : "80",
        height: node.data.height ? String(node.data.height) : "80",
        top: String(Math.round(node.position.y)),
        left: String(Math.round(node.position.x)),
        rotateAngle: node.data.rotateAngle ? String(node.data.rotateAngle) : "0",
        zIndex: node.data.zIndex ? String(node.data.zIndex) : "0",
        color: node.data.color || "#5E5CFF",
        disabled: node.data.disabled || false,
      });
    }
  }
);

// Derived atom that updates the selected node when the slot detail form changes
export const syncSlotDetailAtom = atom(
  (get) => get(slotDetailAtom),
  (get, set, detail: SlotDetailForm) => {
    set(slotDetailAtom, detail);
  }
);
