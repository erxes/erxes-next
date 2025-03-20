import { Fragment } from 'react';
import { Link } from 'react-router';

import { Breadcrumb, Separator } from 'erxes-ui';

export function SettingsBreadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: { title: string; path: string }[];
}) {
  return (
    <div className="flex items-center justify-between px-4 h-16">
      <Breadcrumb>
        <Breadcrumb.List>
          {breadcrumbs.map(({ title, path }, index) => {
            const currentPath = breadcrumbs
              .slice(0, index + 1)
              .map((b) => b.path)
              .join('/');

            return (
              <Fragment key={`breadcrumb-${index}`}>
                <Breadcrumb.Item>
                  <Breadcrumb.Link asChild>
                    <Link to={`/${currentPath}`}>{title}</Link>
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
                {breadcrumbs.length - 1 !== index && (
                  <Separator.Inline key={`separator-${index}`} />
                )}
              </Fragment>
            );
          })}
        </Breadcrumb.List>
      </Breadcrumb>
    </div>
  );
}
