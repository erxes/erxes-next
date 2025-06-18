import { IconProps } from '@tabler/icons-react';
import {
  RecordTable,
  Sidebar,
  useQueryState,
  Collapsible,
  Filter,
  Combobox,
  Command,
  PageSubHeader,
} from 'erxes-ui';
import { Link, useLocation } from 'react-router-dom';
import { permissionColumns } from 'ui-modules/modules/permissions/components/permission-columns';
import { PERMISSION_CURSOR_SESSION_KEY } from 'ui-modules/modules/permissions/constants/permissionCursorSessionKey';
import { usePermissions } from 'ui-modules/modules/permissions/hooks/usePermissions';
import { IconChevronDown } from '@tabler/icons-react';
import path from 'path';
import { PermissionsFilterScope } from 'ui-modules/modules/permissions/types/permission';

export const PermissionsSidebarItem = ({
  to,
  children,
  asChild,
}: {
  to: string;
  children?: React.ReactNode;
  asChild?: boolean;
}) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  const isSubItemActive = !isActive && pathname.includes('moduleName=');
  const shouldShowCaret = isSubItemActive && !isActive;
  const isIconActive = isActive || (isSubItemActive && isActive);
  return (
    <Sidebar.MenuItem>
      <Link to={to}>
        <Sidebar.MenuButton
          className="flex items-center justify-between capitalize"
          isActive={isIconActive}
        >
          permissions
          {shouldShowCaret && <IconChevronDown />}
        </Sidebar.MenuButton>
      </Link>
      {asChild && (
        <Collapsible.Content>
          <Sidebar.GroupContent className="pt-2">
            <Sidebar.Sub>{children}</Sidebar.Sub>
          </Sidebar.GroupContent>
        </Collapsible.Content>
      )}
    </Sidebar.MenuItem>
  );
};

export const PermissionsSidebarSubItem = ({
  path,
  label,
}: {
  path: string;
  label: string;
}) => {
  const [moduleName] = useQueryState<string>('moduleName');
  const isActive = moduleName === label;
  return (
    <Sidebar.SubItem key={path}>
      <Link to={path}>
        <Sidebar.SubButton className="capitalize" isActive={isActive}>
          {label}
        </Sidebar.SubButton>
      </Link>
    </Sidebar.SubItem>
  );
};

export const PermissionsSidebarGroup = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { pathname } = useLocation();
  return (
    <Sidebar.Group>
      <Sidebar.Menu>
        <Collapsible
          defaultOpen
          open={pathname.includes('permissions')}
          className="group/collapsible"
        >
          {children}
        </Collapsible>
      </Sidebar.Menu>
    </Sidebar.Group>
  );
};

export const PermissionsRecordTable = ({ module }: { module?: string }) => {
  const [moduleName] = useQueryState<string>('moduleName');
  const selectedModule = moduleName || module;
  const { handleFetchMore, permissions, loading, error, pageInfo } =
    usePermissions({
      variables: {
        module: selectedModule ?? undefined,
      },
    });
  const { hasPreviousPage, hasNextPage } = pageInfo || {};

  if (error) {
    return (
      <div className="text-destructive">
        Error loading permissions: {error.message}
      </div>
    );
  }

  return (
    <RecordTable.Provider
      columns={permissionColumns}
      data={permissions || []}
      stickyColumns={['more', 'checkbox', 'module', 'action']}
      className="m-3"
    >
      <RecordTable.CursorProvider
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        dataLength={permissions?.length}
        sessionKey={PERMISSION_CURSOR_SESSION_KEY}
      >
        <RecordTable>
          <RecordTable.Header />
          <RecordTable.Body>
            <RecordTable.CursorBackwardSkeleton
              handleFetchMore={handleFetchMore}
            />
            {loading && <RecordTable.RowSkeleton rows={40} />}
            <RecordTable.RowList />
            <RecordTable.CursorForwardSkeleton
              handleFetchMore={handleFetchMore}
            />
          </RecordTable.Body>
        </RecordTable>
      </RecordTable.CursorProvider>
    </RecordTable.Provider>
  );
};

export const PermissionsView = ({ module }: { module?: string }) => {
  return (
    <div className="flex flex-auto w-full overflow-hidden">
      <div className="w-full overflow-hidden flex flex-col">
        <PageSubHeader>
          <PermissionsFilter />
        </PageSubHeader>
        <PermissionsRecordTable module={module} />
      </div>
    </div>
  );
};

export const PermissionsFilter = () => {
  return (
    <Filter id="permissions-filter">
      <Filter.Bar>
        <Filter.Popover scope={PermissionsFilterScope.FilterBar}>
          <Filter.Trigger />
          <Combobox.Content>
            <Filter.View>
              <Command>
                <Filter.CommandInput />
                <Command.List>
                  <Filter.SearchValueTrigger />
                </Command.List>
              </Command>
            </Filter.View>
          </Combobox.Content>
        </Filter.Popover>
        <Filter.Dialog>
          <Filter.DialogStringView filterKey="searchValue" />
        </Filter.Dialog>
        <Filter.SearchValueBarItem />
      </Filter.Bar>
    </Filter>
  );
};

export const Permissions = Object.assign({
  SidebarItem: PermissionsSidebarItem,
  SidebarSubItem: PermissionsSidebarSubItem,
  SidebarGroup: PermissionsSidebarGroup,
  RecordTable: PermissionsRecordTable,
  View: PermissionsView,
});
