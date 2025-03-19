import { Fragment, ReactElement } from 'react';
import { Link } from 'react-router';

import { Breadcrumb } from 'erxes-ui';

export function SettingsBreadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: { title: string; path: string; Icon?: any }[];
}) {
  return (
    <div className="flex items-center justify-between px-4 h-16">
      <Breadcrumb>
        <Breadcrumb.List>
          {breadcrumbs.map(({ title, Icon }, index) => {
            const currentPath = breadcrumbs
              .slice(0, index + 1)
              .map((b) => b.path)
              .join('/');

            return (
              <Fragment key={`breadcrumb-${index}`}>
                <Breadcrumb.Item>
                  <Breadcrumb.Link asChild className="flex items-center gap-1">
                    <Link to={`/${currentPath}`}>
                      <Icon size={14} />
                      {title}
                    </Link>
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
                {breadcrumbs.length - 1 !== index && (
                  <Breadcrumb.Separator key={`separator-${index}`} />
                )}
              </Fragment>
            );
          })}
        </Breadcrumb.List>
      </Breadcrumb>
    </div>
  );
}
