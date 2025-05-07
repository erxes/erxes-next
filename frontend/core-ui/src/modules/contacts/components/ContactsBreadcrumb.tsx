import { Breadcrumb, Button, Separator } from 'erxes-ui';

import { ContactsPath } from '@/types/paths/ContactsPath';
import { Link } from 'react-router-dom';
import { IconBookmarksFilled } from '@tabler/icons-react';

export const ContactsBreadcrumb = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.List className="gap-1">
          <Breadcrumb.Item>
            <Button variant="ghost" asChild>
              <Link to={`/contacts/${ContactsPath.Customers}`}>
                <IconBookmarksFilled className="text-accent-foreground" />
                Contacts
              </Link>
            </Button>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          {children}
        </Breadcrumb.List>
      </Breadcrumb>
      <Separator.Inline />
    </>
  );
};
