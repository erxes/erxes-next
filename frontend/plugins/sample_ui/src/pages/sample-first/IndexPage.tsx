import {
  IconCaretDownFilled,
  IconSandbox,
  IconSettings,
} from '@tabler/icons-react';
import { Breadcrumb, Button, PageHeader, Separator } from 'erxes-ui';
import { Link } from 'react-router-dom';

export const IndexPage = () => {
  return (
    <div className="flex flex-col h-full">
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to="/settings/sample">
                    <IconSandbox />
                    Sample
                  </Link>
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
          <PageHeader.LikeButton />
        </PageHeader.Start>
        <PageHeader.End>
          <Button variant="outline" asChild>
            <Link to="/settings/sample">
              <IconSettings />
              Go to settings
            </Link>
          </Button>
          <Button>
            More <IconCaretDownFilled />
          </Button>
        </PageHeader.End>
      </PageHeader>
      <div className="flex h-full overflow-hidden">
        <div className="flex flex-col h-full overflow-hidden flex-auto">
          <h1>Samplsdsadasdjakljkljklsade</h1>
        </div>
      </div>
    </div>
  );
};
