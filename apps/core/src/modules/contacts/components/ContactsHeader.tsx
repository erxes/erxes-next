import { Breadcrumb, Button, Header, HoverCard } from 'erxes-ui/components';
import { IconPlus, IconInfoCircle } from '@tabler/icons-react';

const ContactsHeader = () => {
  return (
    <Header className="p-0">
      <div className="flex flex-auto items-center justify-between">
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Page className="flex items-center gap-1">
                Contacts
              </Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="icon">
            <IconPlus className="size-3" />
          </Button>
        </div>
      </div>
    </Header>
  );
};

export default ContactsHeader;
