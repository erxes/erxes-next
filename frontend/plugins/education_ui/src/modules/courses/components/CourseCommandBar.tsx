import { IconCopy } from '@tabler/icons-react';

import { Button, CommandBar, RecordTable, Separator } from 'erxes-ui';
import { CoursesDelete } from '@/courses/components/course-command-bar/CoursesDelete';

export const CourseCommandBar = () => {
  const { table } = RecordTable.useRecordTable();

  return (
    <CommandBar open={table.getFilteredSelectedRowModel().rows.length > 0}>
      <CommandBar.Bar>
        <CommandBar.Value>
          {table.getFilteredSelectedRowModel().rows.length} selected
        </CommandBar.Value>
        <Separator.Inline />
        <CoursesDelete
          courseIds={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original._id)}
        />
        <Separator.Inline />
        <Button
          variant="secondary"
          disabled={table.getFilteredSelectedRowModel().rows.length !== 1}
        >
          <IconCopy />
          Copy
        </Button>
      </CommandBar.Bar>
    </CommandBar>
  );
};
