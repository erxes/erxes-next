import { PageHeader } from 'ui-modules';
import { Breadcrumb, Separator } from 'erxes-ui';

import { useParams } from 'react-router-dom';
import { PosBreadCrumb } from '../modules/pos/pos/breadcumb/PosBreadCumb';
import { OrderRecordTable } from '~/modules/orders/components/OrderRecordTable';
import { PosFilter } from '../modules/pos/pos/PosFilter';

export const OrdersPage = () => {
  const { posId } = useParams();

  return (
    <>
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              {posId && (
                <>
                  <PosBreadCrumb />
                  <Separator.Inline />
                </>
              )}
            </Breadcrumb.List>
          </Breadcrumb>
        </PageHeader.Start>
      </PageHeader>
      <PageHeader>
        <PosFilter />
      </PageHeader>
      <OrderRecordTable />
    </>
  );
};
