import { IconTagsFilled } from '@tabler/icons-react';
import { Button } from 'erxes-ui';

export const TagsSettingBreadcrumb = () => {
  return (
    <>
      <Button variant="ghost" className="font-semibold">
        <IconTagsFilled className="w-4 h-4 text-accent-foreground" />
        Tags
      </Button>
    </>
  );
};
