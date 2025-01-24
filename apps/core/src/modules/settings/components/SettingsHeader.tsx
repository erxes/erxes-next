import React from 'react'
import {
  Breadcrumb,
  Header,
} from 'erxes-ui/components';
import { Link } from 'react-router';

type TSettingsHeader = {
  breadcrumbs: {
    title: string,
    path: string
  }[]
}

const SettingsHeader = ({ breadcrumbs }: TSettingsHeader) => {
  return (
    <Header>
      <Breadcrumb.Root>
        <Breadcrumb.List>
          {breadcrumbs.map((breadcrumb, index) => {
            const currentPath = breadcrumbs
              .slice(0, index + 1)
              .map((b) => b.path)
              .join('/');

            return (
              <React.Fragment key={`breadcrumb-${index}`}>
                <Breadcrumb.Item>
                  <Breadcrumb.Link asChild>
                    <Link to={`/${currentPath}`}>{breadcrumb.title}</Link>
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
                {breadcrumbs.length - 1 !== index && (
                  <Breadcrumb.Separator key={`separator-${index}`} />
                )}
              </React.Fragment>
            );
          })}
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </Header>
  )
}

export default SettingsHeader
