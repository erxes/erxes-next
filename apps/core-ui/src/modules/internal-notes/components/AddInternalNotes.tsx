import { IconArrowUp } from '@tabler/icons-react';
import { Button, TextEditor } from 'erxes-ui/components';

export const AddInternalNotes = () => {
  return (
    <div className="pt-5 relative h-full">
      <TextEditor className=" h-full rounded-md" parseTo="html" />
      <Button className="absolute bottom-5 inset-x-8" variant="secondary">
        <IconArrowUp /> Post
      </Button>
    </div>
  );
};
