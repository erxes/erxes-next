import { Button, CustomDialog, Input } from 'erxes-ui/components';
import { IconPlus } from '@tabler/icons-react';
import '@blocknote/core/fonts/inter.css';
import { locales } from '@blocknote/core';
import { BlockNoteView, Theme } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { AddProductForm } from './AddProductForm';
import {
  DragHandleButton,
  SideMenu,
  SideMenuController,
  useCreateBlockNote,
} from '@blocknote/react';

export const AddProductButton = () => {
  const locale = locales['en'];
  const editor = useCreateBlockNote({
    domAttributes: { editor: { class: 'editor' } },
    dictionary: {
      ...locale,
      placeholders: {
        ...locale.placeholders,
        default: 'Add desctiption...',
        heading: 'This is a custom heading',
      },
    },
  });

  const customTheme: Theme = {
    colors: {
      editor: {
        text: 'inherit',
        background: 'transparent',
      },
      menu: {
        text: 'inherit',
        background: 'background',
      },
    },
    borderRadius: 4,
    fontFamily: 'inherit',
  };

  return (
    <CustomDialog
      triggerButton={
        <Button variant="outline" size="icon">
          <IconPlus className="size-3" />
        </Button>
      }
      title="Add Product/Service"
    >
      <AddProductForm />
    </CustomDialog>
  );
};
