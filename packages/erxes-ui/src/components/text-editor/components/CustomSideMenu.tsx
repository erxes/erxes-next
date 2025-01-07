import {
  BlockColorsItem,
  RemoveBlockItem,
  DragHandleButton,
  DragHandleMenu,
  SideMenu,
  SideMenuController,
} from '@blocknote/react';
import { BlockNoteEditor } from '@blocknote/core';
import { AddBlockItem } from './AddBlockItem';
import { IconPlus, IconTrash, IconColorPicker} from '@tabler/icons-react'
interface CustomSideMenuProps{
  editor: BlockNoteEditor;
}
export const CustomSideMenu = ({ editor }: CustomSideMenuProps) => {
  return (
    <SideMenuController
      sideMenu={(props) => (
        <SideMenu {...props}>
          <DragHandleButton
            {...props}
            dragHandleMenu={(props) => (
              <DragHandleMenu {...props}>
                <AddBlockItem {...props} editor={editor}>
                  <div className="flex gap-2 text-sm items-center">
                  <IconPlus className="w-4 h-4"/>
                  Add
                </div>
                </AddBlockItem>
                <BlockColorsItem {...props}>
                  <div className="flex gap-2 text-sm items-center mr-2">
                  <IconColorPicker className="w-4 h-4"/>
                  Colors
                </div>
                </BlockColorsItem>
                <RemoveBlockItem {...props} >
                  <div className="flex gap-2 text-sm text-red-500 items-center">
                  <IconTrash className="w-4 h-4"/>
                  Remove
                </div>
                </RemoveBlockItem>
              </DragHandleMenu>
            )}
          />
        </SideMenu>
      )}
    ></SideMenuController>
  );
};
