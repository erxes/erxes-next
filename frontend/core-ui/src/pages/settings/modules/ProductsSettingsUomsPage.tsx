import { Skeleton, Table, TextOverflowTooltip } from 'erxes-ui';
import { useUoms } from '@/products/settings/hooks/useUoms';
export const ProductsSettingsUomsPage = () => {
  const { uoms, loading } = useUoms();
  return (
    <div className="overflow-auto h-full px-8">
      <div className="bg-sidebar border border-sidebar pl-1 border-t-4 border-l-4 pb-2 pr-2 rounded-lg">
        <Table>
          <Table.Header>
            <Table.Row className="rounded-t-md">
              <Table.Head className="w-auto rounded-tl-md pl-2 ">
                Title
              </Table.Head>
              <Table.Head className="w-52">Code</Table.Head>
              <Table.Head className="w-52">For Subscription</Table.Head>
              <Table.Head className="w-52">Timely</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body className="">
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <TableRowSkeleton key={index} />
                ))
              : uoms?.map((uom) => (
                  <Table.Row
                    key={uom._id}
                    className="hover:cursor-pointer shadow-xs "
                  >
                    <Table.Cell className="font-medium border-none pl-2 w-auto">
                      <span className="w-full flex gap-2 text-base font-medium">
                        <TextOverflowTooltip value={uom.name} />
                      </span>
                    </Table.Cell>
                    <Table.Cell className="border-none px-2 w-52 text-muted-foreground">
clear
                      {uom.code}
                    </Table.Cell>
                    <Table.Cell className="border-none px-2 w-52">
                      {uom.isForSubscription}
                    </Table.Cell>
                    <Table.Cell className="border-none px-2 w-52">
                      {uom.timely}
                    </Table.Cell>
                  </Table.Row>
                ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

const TableRowSkeleton = () => {
  return (
    <Table.Row className="shadow-xs">
      <Table.Cell className="w-auto pl-8 border-none">
        <Skeleton className="h-4 w-10" />
      </Table.Cell>
      <Table.Cell className="w-20 border-none">
        <Skeleton className="h-4 w-5" />
      </Table.Cell>
      <Table.Cell className="w-20 border-none">
        <Skeleton className="h-4 w-5" />
      </Table.Cell>
      <Table.Cell className="w-32 pr-8 border-none">
        <Skeleton className="h-4 w-16" />
      </Table.Cell>
    </Table.Row>
  );
};
