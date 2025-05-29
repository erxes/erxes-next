import {
  RecordTable,
  RecordTableCellContent,
  RecordTableCellDisplay,
  RecordTableCellTrigger,
  RecordTablePopover,
  RecordTableTree,
} from 'erxes-ui/modules/record-table';
import { useCourseCategories } from '@/courses/hooks/useCourseCategories';
import { ICourseCategory } from '@/courses/types/courseType';
import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import { IconHash, IconLabelFilled, IconPackage } from '@tabler/icons-react';
import { Input } from 'erxes-ui/components';

export const CourseCategoryRecordTable = () => {
  const { courseCategories, loading } = useCourseCategories({});

  const categories = courseCategories?.map((category: ICourseCategory) => ({
    ...category,
    hasChildren: courseCategories?.some(
      (c: ICourseCategory) => c.parentId === category._id,
    ),
  }));

  const categoryObject = useMemo(() => {
    return categories?.reduce(
      (acc: Record<string, ICourseCategory>, category: ICourseCategory) => {
        acc[category._id] = category;
        return acc;
      },
      {},
    );
  }, [categories]);

  return (
    <RecordTable.Provider
      columns={courseCategoryColumns(categoryObject || {})}
      data={courseCategories || []}
      className="m-3"
    >
      <RecordTableTree id="product-categories" ordered>
        <RecordTable.Scroll>
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.RowList
                Row={(props) => (
                  <RecordTableTree.Row
                    {...props}
                    order={categoryObject[props.id as string]?.order}
                    name={categoryObject[props.id as string]?.name}
                  />
                )}
              />
              {loading && <RecordTable.RowSkeleton rows={30} />}
            </RecordTable.Body>
          </RecordTable>
        </RecordTable.Scroll>
      </RecordTableTree>
    </RecordTable.Provider>
  );
};

export const courseCategoryColumns: (
  categoryObject: Record<string, ICourseCategory>,
) => ColumnDef<ICourseCategory & { hasChildren: boolean }>[] = (
  categoryObject,
) => [
  RecordTable.checkboxColumn as ColumnDef<
    ICourseCategory & { hasChildren: boolean }
  >,
  {
    id: 'name',
    header: () => (
      <RecordTable.InlineHead icon={IconLabelFilled} label="Name" />
    ),
    accessorKey: 'name',
    cell: ({ cell }) => {
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <RecordTableTree.Trigger
              order={cell.row.original.order}
              name={cell.getValue() as string}
              hasChildren={cell.row.original.hasChildren}
            >
              {cell.getValue() as string}
            </RecordTableTree.Trigger>
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Input value={cell.getValue() as string} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
    size: 300,
  },
  {
    id: 'code',
    header: () => <RecordTable.InlineHead icon={IconHash} label="Code" />,
    accessorKey: 'code',
    cell: ({ cell }) => {
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            {cell.getValue() as string}
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Input value={cell.getValue() as string} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
  },

  {
    id: 'courseCount',
    header: () => (
      <RecordTable.InlineHead icon={IconPackage} label="Course Count" />
    ),
    accessorKey: 'courseCount',
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay>
          {cell.getValue() as number}
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'parentId',
    header: () => <RecordTable.InlineHead icon={IconPackage} label="Parent" />,
    accessorKey: 'parentId',
    cell: ({ cell }) => {
      const parent = categoryObject[cell.getValue() as string];
      return <RecordTableCellDisplay>{parent?.name}</RecordTableCellDisplay>;
    },
    size: 300,
  },
];
