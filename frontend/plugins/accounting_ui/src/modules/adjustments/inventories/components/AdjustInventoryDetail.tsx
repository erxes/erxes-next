import {
  Button,
  Spinner,
  DatePicker,
  useQueryState,
  RecordTable,
} from 'erxes-ui';
import { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSetAtom } from 'jotai';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconCrane, IconGavel, IconStopwatch, IconTrashX } from '@tabler/icons-react';
import { useAdjustInventoryDetail } from '../hooks/useAdjustInventoryDetail';
import { useAdjustInventoryDetails } from '../hooks/useAdjustInventoryDetails';
import { ADJ_INV_STATUSES } from '~/modules/adjustments/inventories/types/AdjustInventory';
import { useAdjustInventoryRun } from '../hooks/useAdjustInventoryRun';
import { adjustDetailTableColumns } from './AdjustInventoryDetailColumns';

export const AdjustInventoryDetail = () => {
  // const parentId = useParams().parentId;
  const [id] = useQueryState<string>('id');

  const { adjustInventory, loading } = useAdjustInventoryDetail({
    variables: { _id: id },
    skip: !id,
  });

  const { adjustInventoryDetails, adjustInventoryDetailsCount, loading: detailsLoading, handleFetchMore } = useAdjustInventoryDetails({
    variables: { _id: id },
    skip: !id,
  });

  const { runAdjust, loading: runLoading } = useAdjustInventoryRun(id ?? '');

  if (loading || detailsLoading) {
    return <Spinner />;
  }

  if (!id) {
    return;
  }

  const handleRun = () => {
    runAdjust();
  }

  const renderEvents = () => {
    const status = adjustInventory?.status || ADJ_INV_STATUSES.DRAFT;
    switch (status) {
      case ADJ_INV_STATUSES.DRAFT:
      case ADJ_INV_STATUSES.CANCEL:
        return (
          <>
            <Button
              onClick={handleRun}
            >
              <IconCrane />
              RUN
            </Button>
            <Button
              variant="secondary"
              className="text-destructive"
            >
              <IconTrashX />
              Delete
            </Button>
          </>
        )
      case ADJ_INV_STATUSES.PUBLISH:
        return (
          <Button
            variant="secondary"
            className="text-destructive"
          // onClick={handleDelete}
          >
            <IconTrashX />
            Draft
          </Button>
        )
      case ADJ_INV_STATUSES.COMPLETE:
        return (
          <Button
          // onClick={handleDelete}
          >
            <IconGavel />
            PUBLISH
          </Button>
        )
      case ADJ_INV_STATUSES.RUNNING:
        return (
          <Button
            // disabled={true}
            onClick={handleRun}
          >
            <IconStopwatch />
            Stop
          </Button>

        )

      default:
        return null;
    }
  }

  return (
    <>
      <div className="m-3 flex-auto">
        <h3 className="text-lg font-bold">
          Inventory Adjustment Detail
        </h3>
        <div className="flex justify-end items-center col-span-2 xl:col-span-3 gap-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-accent-foreground">Status:</span>
            <span className="text-primary font-bold">
              {adjustInventory?.status}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-accent-foreground">Begin Date:</span>
            <span className="text-primary font-bold">
              <DatePicker
                value={adjustInventory?.beginDate}
                onChange={() => null}
                className="h-8 flex w-full"
              />
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-accent-foreground">Date:</span>
            <span className="text-primary font-bold">
              <DatePicker
                value={adjustInventory?.date}
                onChange={() => null}
                className="h-8 flex w-full"
              />
            </span>
          </div>
          {renderEvents()}

        </div>
      </div>
      <RecordTable.Provider
        columns={adjustDetailTableColumns}
        data={adjustInventoryDetails || []}
        stickyColumns={[]}
        className='m-3'
      >
        <RecordTable.Scroll>
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.RowList />
              {!detailsLoading && adjustInventoryDetailsCount > adjustInventoryDetails?.length && (
                <RecordTable.RowSkeleton rows={4} handleInView={handleFetchMore} />
              )}
            </RecordTable.Body>
          </RecordTable>
        </RecordTable.Scroll>
      </RecordTable.Provider>
    </>
  );
};
