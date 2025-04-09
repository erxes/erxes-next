import { gql, useQuery } from '@apollo/client';
import {
  IconCaretDownFilled,
  IconSandbox,
  IconSettings,
  IconInfoCircle,
  IconProgressCheck,
  IconProgressX,
  IconCalendarTime,
  IconSourceCode,
  IconUser,
} from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import {
  Avatar,
  Badge,
  Button,
  cn,
  PluginHeader,
  RecordTable,
  RelativeDateDisplay,
  TablerIcon,
  TablerIconNamesType,
} from 'erxes-ui';
import { Link } from 'react-router-dom';
import { RecordTableInlineCell } from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';
import dayjs from 'dayjs';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';

const query = `
  query LogsMainList {
    logsMainList {
      list {
        _id
        createdAt
        payload
        source
        action
        status
        userId
      }
      totalCount
    }
  }
`;

type QueryResponse = {
  logsMainList: {
    list: any[];
    totalCount: number;
  };
};

const statusInfos = {
  success: {
    color: 'bg-green-500 text-primary-foreground',
    icon: 'IconProgressCheck',
  },
  failed: {
    color: 'bg-green-500 text-primary-foreground',
    icon: 'IconProgressX',
  },
};

type Size = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

type Props = {
  user?: any;
  size?: Size;
};

export default function AvatarPopover({ user, size }: Props) {
  if (!user) {
    return null;
  }

  const getUserName = (user: any) => {
    if (user?.firstName || user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || '';
  };

  const userName = getUserName(user);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar size={'sm'}>
            <AvatarImage src={user?.avatar} alt={user?.email} />
            <AvatarFallback>{userName[0]}</AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>{`${userName}`}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const columns: ColumnDef<any>[] = [
  {
    id: 'status',
    accessorKey: 'status',
    header: () => (
      <RecordTable.InlineHead icon={IconInfoCircle} label="Status" />
    ),
    cell: ({ cell }) => {
      const { status } = (cell?.row?.original || {}) as {
        status: 'failed' | 'success';
      };

      const { icon, color } = statusInfos[status] || {};

      return (
        <RecordTableInlineCell
          containerClassName="justify-center"
          display={() => (
            <Badge>
              <TablerIcon name={icon as TablerIconNamesType} />
              {status}
            </Badge>
          )}
        />
      );
    },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: () => (
      <RecordTable.InlineHead icon={IconCalendarTime} label="Created At" />
    ),
    cell: ({ cell }) => {
      const { createdAt } = cell?.row?.original || {};
      return (
        <RecordTableInlineCell
          containerClassName="justify-center"
          display={() => (
            <div>{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
          )}
        />
      );
    },
  },
  {
    id: 'source',
    accessorKey: 'source',
    header: () => (
      <RecordTable.InlineHead icon={IconSourceCode} label="Source" />
    ),
    cell: ({ cell }) => {
      const { source } = cell?.row?.original || {};
      return (
        <RecordTableInlineCell
          containerClassName="justify-center"
          display={() => <div>{source}</div>}
        />
      );
    },
  },
  {
    id: 'action',
    accessorKey: 'action',
    header: () => <RecordTable.InlineHead icon={IconSettings} label="Action" />,
    cell: ({ cell }) => {
      const { action } = cell?.row?.original || {};
      return (
        <RecordTableInlineCell
          containerClassName="justify-center"
          display={() => <div>{action}</div>}
        />
      );
    },
  },
  {
    id: 'userId',
    accessorKey: 'userId',
    header: () => <RecordTable.InlineHead icon={IconUser} label="User" />,
    cell: ({ cell }) => {
      const { userId, user } = cell?.row?.original || {};
      return <AvatarPopover user={user} />;
    },
  },
];

export const Page = (...props: any) => {
  console.log({ props });

  const { data, loading } = useQuery<QueryResponse>(gql(query));

  if (loading) {
    return <>Loading...</>;
  }

  const { list = [], totalCount = 0 } = data?.logsMainList || {};

  return (
    <div className="flex flex-col h-full">
      <PluginHeader
        title="Sample"
        icon={IconSandbox}
        className="p-3 mx-0"
        separatorClassName="mb-0"
      >
        <Button variant="outline" asChild>
          <Link to="/settings/sample">
            <IconSettings />
            Go to settings
          </Link>
        </Button>
        <Button>
          More <IconCaretDownFilled />
        </Button>
      </PluginHeader>
      <div className="flex-1">
        <RecordTable.Provider
          columns={columns}
          data={list}
          // handleReachedBottom={handleFetchMore}
          // stickyColumns={['avatar', 'name']}
          className="mt-1.5"
          moreColumn={{
            id: 'detail',
            cell: ({ cell }) => (
              <div className="flex w-full justify-center">
                <Button variant="ghost" size="icon">
                  <TablerIcon
                    name="IconEye"
                    className="text-muted-foreground"
                  />
                </Button>
              </div>
            ),
            size: 33,
          }}
        >
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body />
          </RecordTable>
        </RecordTable.Provider>
      </div>
    </div>
  );
};
