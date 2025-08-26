import { Button, cn, Label, Spinner } from 'erxes-ui';
import { FormProvider } from 'react-hook-form';
import { useSegmentActions } from 'ui-modules/modules/segments/hooks/useSegmentActions';
import { useSegmentDetail } from 'ui-modules/modules/segments/hooks/useSegmentDetail';

import { SegmentFormFooter } from 'ui-modules/modules/segments/components/form/SegmentFormFooter';
import { SegmentMetadataForm } from 'ui-modules/modules/segments/components/form/SegmentMetadataForm';
import {
  SegmentProvider,
  useSegment,
} from 'ui-modules/modules/segments/context/SegmentProvider';
import { SegmentGroup } from './SegmentGroup';
import { SegmentGroups } from './SegmentGroups';

type Props = {
  contentType: string;
  segmentId?: string;
  callback: (contentId: string) => void;
  isTemporary?: boolean;
};

const SegmentFormContent = () => {
  const { form } = useSegment();
  const conditionSegments = form.watch('conditionSegments');

  if (conditionSegments?.length) {
    return <SegmentGroups />;
  }

  return <SegmentGroup />;
};

const SegmentFormA = ({
  callback,
  isTemporary,
}: {
  isTemporary?: boolean;
  callback?: (contentId: string) => void;
}) => {
  const { form } = useSegment();

  const { watch } = form;

  const { onAddSegmentGroup } = useSegmentActions({ callback });

  return (
    <FormProvider {...form}>
      <form id="segment-form" className="h-full flex flex-col">
        <div className="flex flex-col flex-1 max-h-full px-8 pt-4 pb-4 overflow-y-auto w-2xl">
          <SegmentMetadataForm isTemporary={isTemporary} />
          <div className="pb-4">
            <SegmentFormContent />
          </div>
          <Button
            variant="secondary"
            className={cn(
              'w-full',
              (watch('conditionSegments')?.length || 0) > 1 && 'pl-12',
            )}
            onClick={onAddSegmentGroup}
          >
            <Label>+ Add Group</Label>
          </Button>
        </div>
        <SegmentFormFooter callback={callback} />
      </form>
    </FormProvider>
  );
};

export function SegmentForm({
  contentType,
  isTemporary,
  callback,
  segmentId,
}: Props) {
  const { segment, segmentLoading } = useSegmentDetail(segmentId);

  if (segmentLoading) {
    return <Spinner />;
  }

  const updatedProps = {
    isTemporary,
    callback,
  };

  return (
    <SegmentProvider contentType={contentType} segment={segment}>
      <SegmentFormA {...updatedProps} />
    </SegmentProvider>
  );
}
