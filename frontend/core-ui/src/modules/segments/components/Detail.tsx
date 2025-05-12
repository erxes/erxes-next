import {
  ApolloQueryResult,
  OperationVariables,
  useQuery,
} from '@apollo/client';
import { IconPlus } from '@tabler/icons-react';
import { useQueryState } from 'erxes-ui';
import { Button, Sheet } from 'erxes-ui/components';
import { useState } from 'react';
import queries from 'ui-modules/modules/segments/graphql/queries';
import { ISegment, ListQueryResponse } from 'ui-modules/modules/segments/types';
import SegmentForm from 'ui-modules/modules/segments/form';
// import {SegmentForm} from 'ui-modules';

type Props = {
  refetch: (
    variables?: Partial<OperationVariables> | undefined,
  ) => Promise<ApolloQueryResult<ListQueryResponse>>;
};

export default function SegmentDetail({ refetch }: Props) {
  const [selectedContentType] = useQueryState<string>('contentType');

  if (!selectedContentType) {
    return null;
  }

  const [segmentId, setOpen] = useQueryState<string>('segmentId');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  let segment: ISegment | undefined;

  const { data } = useQuery(queries.segmentDetail, {
    variables: { _id: segmentId },
    skip: !segmentId || !selectedContentType,
  });

  if (data?.segmentDetail) {
    segment = data.segmentDetail;
  }

  return (
    <Sheet
      open={!!segmentId || isCreatingNew}
      onOpenChange={() => {
        if (!!segmentId) {
          setOpen(null);
        } else {
          setIsCreatingNew(!isCreatingNew);
        }
      }}
    >
      <Sheet.Trigger asChild>
        <Button
          onClick={() => setIsCreatingNew(!isCreatingNew)}
          disabled={!selectedContentType}
        >
          <IconPlus /> Create Segment
        </Button>
      </Sheet.Trigger>

      <Sheet.View
        className="p-0 md:max-w-screen-lg"
        onEscapeKeyDown={(e: any) => {
          e.preventDefault();
        }}
      >
        <Sheet.Content className="h-full">
          <div className="h-full flex flex-col">
            <Sheet.Header className="border-b p-3 flex-row items-center space-y-0 gap-3">
              <Sheet.Title>{`${
                segment ? 'Edit' : 'Create'
              } a segment`}</Sheet.Title>
              <Sheet.Close />
            </Sheet.Header>
            <SegmentForm
              contentType={selectedContentType}
              segment={segment}
              callback={() => refetch()}
            />
          </div>
        </Sheet.Content>
      </Sheet.View>
    </Sheet>
  );
}
