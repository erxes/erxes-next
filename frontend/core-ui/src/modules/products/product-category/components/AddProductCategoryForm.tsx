import { IconPlus } from '@tabler/icons-react';
import { Sheet, Button, Form } from 'erxes-ui';

export const AddProductCategoryForm = () => {
  return (
    <Sheet>
      <Sheet.Trigger asChild>
        <Button>
          <IconPlus />
          Add Category
        </Button>
      </Sheet.Trigger>
      <Sheet.View></Sheet.View>
    </Sheet>
  );
};
