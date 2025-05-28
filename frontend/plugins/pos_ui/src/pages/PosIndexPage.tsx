import { IconCashRegister, IconPlus, IconSettings } from '@tabler/icons-react';
import { Breadcrumb, Button, Separator } from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import { Link, useSearchParams } from 'react-router-dom';
import { PosRecordTable } from '~/modules/components/PosRecordTable';
import { renderingPosDetailAtom } from '~/modules/create-pos/states/renderingPosDetailAtom';
import { useAtom } from 'jotai';
import { PosDetail } from '~/modules/create-pos/components/index/pos-create';
import { PosDetailSheet } from '~/modules/pos-detail.tsx/components/posDetailSheet';

export const PosIndexPage = () => {
  const [, setSearchParams] = useSearchParams();
  const [, setRenderingPosDetail] = useAtom(renderingPosDetailAtom);

  const onCreatePos = () => {
    setRenderingPosDetail(true);
    setSearchParams({ create: 'true' });
  };
  return (
    <div className="flex flex-col h-full">
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to="/pos">
                    <IconCashRegister />
                    pos
                  </Link>
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
        <PageHeader.End>
          <Button variant="outline" asChild>
            <Link to="/settings/pos">
              <IconSettings />
              Go to settings
            </Link>
          </Button>
          <Button onClick={onCreatePos}>
            <IconPlus className="mr-2 h-4 w-4" />
            Create POS
          </Button>
        </PageHeader.End>
      </PageHeader>
      <PosDetail />
      <PosRecordTable />
      <PosDetailSheet/>
    </div>
  );
};
