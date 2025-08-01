import { Breadcrumb } from 'erxes-ui';
import { IconArrowLeft } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

import { TeamDetails } from '@/team/components/team-details/TeamDetails';

export const TeamDetailPage = () => {
  return (
    <div>
      <div className="px-4 h-16 flex items-center">
        <Breadcrumb>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link asChild className="flex items-center gap-1">
                <Link
                  className="text-foreground font-semibold"
                  to={`/settings/operation/team`}
                >
                  <IconArrowLeft size={16} className="stroke-foreground" />
                  Teams
                </Link>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
      </div>
      <section className="mx-auto max-w-2xl w-full relative">
        <div className="flex items-center">
          <TeamDetails />
        </div>
      </section>
    </div>
  );
};
