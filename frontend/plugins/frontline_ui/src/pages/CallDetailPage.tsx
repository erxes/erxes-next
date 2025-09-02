import {
  IconChevronLeft,
  IconInfoCircle,
  IconPhone,
  IconSearch,
} from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import {
  Breadcrumb,
  Button,
  Collapsible,
  Badge,
  PageContainer,
  RecordTable,
  RecordTableInlineCell,
  RelativeDateDisplay,
  Separator,
  Input,
  toast,
} from 'erxes-ui';
import { Link, useParams } from 'react-router-dom';
import { PageHeader } from 'ui-modules';
import { useState } from 'react';
import { useSubscription } from '@apollo/client';
import { queueRealtimeUpdate } from '@/integrations/call/graphql/subscriptions/subscriptions';

export const CallDetailPage = () => {
  const { id } = useParams();

  const { data, loading, error } = useSubscription(queueRealtimeUpdate, {
    variables: { extension: id },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link asChild>
                  <Button variant="ghost" asChild>
                    <Link to="/frontline/calls">
                      <IconPhone />
                      Calls
                    </Link>
                  </Button>
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Button
                  variant="ghost"
                  className="hover:bg-transparent cursor-default"
                >
                  6501 - Admin
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
        </PageHeader.Start>
      </PageHeader>
      <div className="flex flex-col flex-auto overflow-hidden p-5 gap-5">
        <div>
          <Button variant="ghost" asChild className="px-2 gap-1">
            <Link to="/frontline/calls">
              <IconChevronLeft />
              Go back to queues
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          <CallDetailCard
            title="total agents"
            description="Total agents"
            value="24"
            date="2025-08-29T10:00:00.000Z"
          />
        </div>
        <div className="grid grid-cols-2 grid-rows-2 flex-1 gap-5">
          <CallDetailAgents />
          <CallDetailWaiting />
          <CallDetailTalking />
        </div>
      </div>
    </PageContainer>
  );
};

export const CallDetailAgents = () => {
  const [search, setSearch] = useState('');
  return (
    <div className="row-span-2 flex flex-col gap-3">
      <h5 className="font-mono text-xs uppercase font-semibold">Agents</h5>
      <div className="relative">
        <IconSearch className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-accent-foreground" />
        <Input
          placeholder="Search"
          value={search}
          className="pl-8 relative bg-transparent"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <RecordTable.Provider columns={agentColumns} data={[]}>
        <RecordTable.Scroll>
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.RowList />
            </RecordTable.Body>
          </RecordTable>
        </RecordTable.Scroll>
      </RecordTable.Provider>
    </div>
  );
};

export const agentColumns: ColumnDef<{
  status: string;
  extention: string;
  name: string;
  answered: number;
  pauseTime: number;
  talkTime: number;
}>[] = [
  {
    accessorKey: 'status',
    header: () => <RecordTable.InlineHead label="Status" />,
    cell: ({ cell }) => (
      <RecordTableInlineCell>
        <Badge variant="secondary">{cell.getValue() as string}</Badge>
      </RecordTableInlineCell>
    ),
    size: 100,
  },
  {
    accessorKey: 'extention',
    header: () => <RecordTable.InlineHead label="Extention" />,
    cell: ({ cell }) => (
      <RecordTableInlineCell>{cell.getValue() as string}</RecordTableInlineCell>
    ),
    size: 100,
  },

  {
    accessorKey: 'name',
    header: () => <RecordTable.InlineHead label="Name" />,
    cell: ({ cell }) => (
      <RecordTableInlineCell>{cell.getValue() as string}</RecordTableInlineCell>
    ),
    size: 100,
  },
  {
    accessorKey: 'answered',
    header: () => <RecordTable.InlineHead label="Answered" />,
    cell: ({ cell }) => (
      <RecordTableInlineCell>{cell.getValue() as string}</RecordTableInlineCell>
    ),
    size: 100,
  },
  {
    accessorKey: 'pauseTime',
    header: () => <RecordTable.InlineHead label="Pause Time" />,
    cell: ({ cell }) => (
      <RecordTableInlineCell>{cell.getValue() as string}</RecordTableInlineCell>
    ),
    size: 100,
  },
  {
    accessorKey: 'talkTime',
    header: () => <RecordTable.InlineHead label="Talk Time" />,
    cell: ({ cell }) => (
      <RecordTableInlineCell>{cell.getValue() as string}</RecordTableInlineCell>
    ),
    size: 100,
  },
];

export const CallDetailCard = ({
  description,
  value,
  title,
  date,
}: {
  description: string;
  value: string;
  title: string;
  date: string;
}) => {
  return (
    <div className="bg-accent rounded-xl p-1">
      <div className="flex items-center justify-between px-2 h-7">
        <h4 className="text-xs font-medium font-mono uppercase">{title}</h4>
        <Collapsible>
          <Collapsible.Trigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground size-6"
            >
              <IconInfoCircle />
            </Button>
          </Collapsible.Trigger>
          <Collapsible.Content>{description}</Collapsible.Content>
        </Collapsible>
      </div>
      <div className="bg-background rounded-lg px-3 py-2 shadow-sm space-y-2">
        <h3 className="font-semibold text-2xl leading-none">{value}</h3>
        <Separator />
        <div className="text-accent-foreground text-xs leading-none">
          updated <RelativeDateDisplay.Value value={date} />
        </div>
      </div>
    </div>
  );
};

export const CallDetailWaiting = () => {
  return (
    <div className="flex flex-col gap-3">
      <h5 className="font-mono text-xs uppercase font-semibold">Waiting</h5>
      <RecordTable.Provider columns={agentColumns} data={[]}>
        <RecordTable.Scroll>
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.RowList />
            </RecordTable.Body>
          </RecordTable>
        </RecordTable.Scroll>
      </RecordTable.Provider>
    </div>
  );
};

export const CallDetailTalking = () => {
  return (
    <div className="flex flex-col gap-3">
      <h5 className="font-mono text-xs uppercase font-semibold">Talking</h5>
      <RecordTable.Provider columns={agentColumns} data={[]}>
        <RecordTable.Scroll>
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.RowList />
            </RecordTable.Body>
          </RecordTable>
        </RecordTable.Scroll>
      </RecordTable.Provider>
    </div>
  );
};
