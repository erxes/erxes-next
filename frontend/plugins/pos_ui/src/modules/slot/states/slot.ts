import { atom } from "jotai";
import { CustomNode, SlotDetailForm } from "../types";
export const selectedNodeAtom = atom<CustomNode | null>(null);

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

export const sidebarViewAtom = atom<"list" | "detail" | "hidden">("list");

export const isFullscreenAtom = atom<boolean>(false);

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

export const syncSlotDetailAtom = atom(
  (get) => get(slotDetailAtom),
  (get, set, detail: SlotDetailForm) => {
    set(slotDetailAtom, detail);
  }
);
