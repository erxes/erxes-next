import { Button, DropdownMenu } from 'erxes-ui/components';
import { TagIcon } from 'lucide-react';

export const ProductsRecordTableOptions = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" className="text-muted-foreground">
          Options
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>Products</DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <TagIcon />
            Fields
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item>Title</DropdownMenu.Item>
            <DropdownMenu.Item>Description</DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
