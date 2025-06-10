import {
  AssignMemberItem,
  AssignMemberList,
  IUser,
  MemberListInline,
} from 'ui-modules';
import { Filter, Input, Popover, useMultiQueryState } from 'erxes-ui';
import {
  IconCalendarPlus,
  IconProgressCheck,
  IconSourceCode,
  IconUser,
} from '@tabler/icons-react';

import { LOGS_COMMON_FILTER_FIELD_NAMES } from '@/logs/constants/logFilter';
import { LogActionsFilter } from './LogActionFilter';
import { LogRecordTableFilterBarOperator } from './LogRecordTableFilterBarOperator';
import { LogSourceFilter } from './LogSourceFilter';
import { LogStatusFilter } from './LogStatusFilter';
import { useSearchParams } from 'react-router';
import { useState } from 'react';

const getCustomFilters = (searchParams: URLSearchParams) => {
  const paramKeys = Array.from(searchParams.keys());

  const customFilterFields = paramKeys.filter(
    (key) => !LOGS_COMMON_FILTER_FIELD_NAMES.includes(key),
  );

  return customFilterFields
    .filter((field) => !field.includes('Operator'))
    .map((customFilterField) => ({
      name: customFilterField,
      value: searchParams.get(customFilterField),
    }));
};
export const LogRecordTableFilterBars = () => {
  const [editingFields, setFieldAsEdit] = useState(
    {} as { [key: string]: boolean },
  );
  const [searchParams] = useSearchParams();

  const [queries, setQueries] = useMultiQueryState<{
    status: string[];
    source: string;
    action: string;
    userIds: string[];
    createdAt: string;
  }>(['status', 'source', 'action', 'userIds', 'createdAt']);
  const { status, source, action, userIds, createdAt } = queries;

  const customFilters = getCustomFilters(searchParams);
  const handleUserSelect = (user?: IUser) => {
    if (!user) {
      return;
    }

    if (userIds?.includes(user?._id)) {
      return setQueries({
        userIds: userIds.filter((userId) => userId !== user?._id),
      });
    }

    return setQueries({ userIds: [...(userIds || []), user?._id] });
  };

  return (
    <Filter.Bar>
      {!!status && (
        <Filter.BarItem>
          <Filter.BarName>
            <IconProgressCheck />
            Status
          </Filter.BarName>
          <LogRecordTableFilterBarOperator fieldName="status" />
          <Popover>
            <Popover.Trigger>
              <Filter.BarButton filterKey="status">{status}</Filter.BarButton>
            </Popover.Trigger>
            <Popover.Content>
              <LogStatusFilter />
            </Popover.Content>
          </Popover>
          <Filter.BarClose filterKey="status" />
        </Filter.BarItem>
      )}

      {!!source && (
        <Filter.BarItem>
          <Filter.BarName>
            <IconSourceCode />
            Source
          </Filter.BarName>
          <LogRecordTableFilterBarOperator fieldName="source" />

          <Popover>
            <Popover.Trigger>
              <Filter.BarButton filterKey="source">{source}</Filter.BarButton>
            </Popover.Trigger>
            <Popover.Content>
              <LogSourceFilter />
            </Popover.Content>
          </Popover>

          <Filter.BarClose filterKey="source" />
        </Filter.BarItem>
      )}
      {!!createdAt && (
        <Filter.BarItem>
          <Filter.BarName>
            <IconCalendarPlus />
            Created At
          </Filter.BarName>
          <LogRecordTableFilterBarOperator fieldName="createdAt" />
          <Filter.Date filterKey="createdAt" />
          <Filter.BarClose filterKey="createdAt" />
        </Filter.BarItem>
      )}

      {!!action && (
        <Filter.BarItem>
          <Filter.BarName>
            <IconProgressCheck />
            Action
          </Filter.BarName>
          <LogRecordTableFilterBarOperator fieldName="action" />

          <Popover>
            <Popover.Trigger>
              <Filter.BarButton filterKey="action">{action}</Filter.BarButton>
            </Popover.Trigger>
            <Popover.Content>
              <LogActionsFilter />
            </Popover.Content>
          </Popover>
          <Filter.BarClose filterKey="action" />
        </Filter.BarItem>
      )}
      {!!userIds?.length && (
        <Filter.BarItem>
          <Filter.BarName>
            <IconUser />
            User
          </Filter.BarName>
          <LogRecordTableFilterBarOperator fieldName="userIds" />

          <Popover>
            <Popover.Trigger>
              <Filter.BarButton filterKey="userIds">
                <MemberListInline memberIds={userIds} />
              </Filter.BarButton>
            </Popover.Trigger>
            <Popover.Content>
              <AssignMemberList
                renderItem={(user) => (
                  <AssignMemberItem
                    key={user._id}
                    user={user}
                    isSelected={(userIds || [])?.includes(user._id)}
                    handleSelect={handleUserSelect}
                  />
                )}
              />
            </Popover.Content>
          </Popover>
          <Filter.BarClose filterKey="userIds" />
        </Filter.BarItem>
      )}

      {customFilters.map(({ name, value }) => (
        <Filter.BarItem>
          <Filter.BarName
            onDoubleClick={() =>
              setFieldAsEdit({ ...editingFields, [name]: !editingFields[name] })
            }
          >
            {editingFields[name] ? (
              <Input
                placeholder="Type a filter name "
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setQueries({
                      [e.currentTarget.value]: value,
                      [name]: null,
                    });
                  }
                }}
              />
            ) : (
              name
            )}
          </Filter.BarName>
          <LogRecordTableFilterBarOperator fieldName={name as any} />
          <Popover>
            <Popover.Trigger>
              <Filter.BarButton filterKey={name}>{value}</Filter.BarButton>
            </Popover.Trigger>
            <Popover.Content>
              <Input
                className="p-2m mt-2"
                placeholder="Type a filter value "
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setQueries({ [name]: e.currentTarget.value });
                  }
                }}
              />
            </Popover.Content>
          </Popover>
          <Filter.BarClose filterKey={name} />
        </Filter.BarItem>
      ))}
    </Filter.Bar>
  );
};
