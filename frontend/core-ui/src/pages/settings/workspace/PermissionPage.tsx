import {
  IconBox,
  IconLayoutSidebar,
  IconMinusVertical,
  IconPlus,
  IconTool,
} from '@tabler/icons-react';
import { Breadcrumb, Button, ScrollArea } from 'erxes-ui';
import { Permission } from '~/modules/settings/permission/components/Permission';
import { Fragment } from 'react';
import { Link } from 'react-router';

const paths = [
  { title: 'Setting', path: 'settings', Icon: IconBox },
  { title: 'Permission', path: 'permission', Icon: IconBox },
];

export function PermissionPage() {
  return (
    <ScrollArea>
      <section className="mx-auto w-full relative">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <IconLayoutSidebar />
            </Button>
            <Breadcrumb>
              <Breadcrumb.List>
                {paths.map(({ title, Icon }, index) => {
                  const currentPath = paths
                    .slice(0, index + 1)
                    .map((b) => b.path)
                    .join('/');

                  return (
                    <Fragment key={`breadcrumb-${index}`}>
                      <Breadcrumb.Item>
                        <Breadcrumb.Link
                          asChild
                          className="flex items-center gap-1"
                        >
                          <Link to={`/${currentPath}`}>
                            <Icon size={14} />
                            {title}
                          </Link>
                        </Breadcrumb.Link>
                      </Breadcrumb.Item>
                      {paths.length - 1 !== index && (
                        <IconMinusVertical size={14} key={`separator-${index}`} />
                        // <Breadcrumb.Separator key={`separator-${index}`} />
                      )}
                    </Fragment>
                  );
                })}
              </Breadcrumb.List>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-4">
            <Button type="button" variant="ghost" className="border">
              <IconTool />
              Fix Permission
            </Button>
            <Button type="button">
              <IconPlus />
              New Permission
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-8 px-4 w-full h-auto">
          <Permission />
        </div>
      </section>
      <ScrollArea.Bar />
    </ScrollArea>
  );
}
