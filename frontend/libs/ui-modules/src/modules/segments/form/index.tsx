import {
  ApolloError,
  useLazyQuery,
  useMutation,
  useQuery,
} from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Spinner, useToast } from 'erxes-ui';
import { Button, Input, Label, Sheet, Textarea } from 'erxes-ui';
import { useEffect, useState } from 'react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
// import client from '~/providers/apollo-provider/apolloClient';
import { generateParamsPreviewCount } from '../common';
import { SelectSegmentCommand } from '../common/SelectSegment';
import mutations from '../graphql/mutations';
import queries from '../graphql/queries';
import { ISegment } from '../types';
import { getDefaultValues } from './defaultValues';
import { segmentFormSchema } from './schema';
import Segment from './Segment';
import { Segments } from './Segments';

type Props = {
  contentType: string;
  segmentId?: string;
  callback: (contentId: string) => void;
  isTempoaray?: boolean;
};

type StatsType = {
  total?: number;
  targeted?: number;
  percentage?: number;
  loading?: boolean;
};

const renderContent = ({
  form,
  contentType,
}: {
  contentType: string;
  form: UseFormReturn<z.infer<typeof segmentFormSchema>>;
}) => {
  const conditionSegments = form.watch('conditionSegments');

  if (conditionSegments?.length) {
    return <Segments form={form} contentType={contentType} />;
  }

  return <Segment form={form} contentType={contentType} />;
};

interface SegmentMetadataFormProps {
  form: UseFormReturn<z.infer<typeof segmentFormSchema>>;
  segment?: ISegment;
  isTemporary?: boolean;
}

const SegmentMetadataForm = ({
  form,
  segment,
  isTemporary,
}: SegmentMetadataFormProps) => {
  if (isTemporary) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-row gap-4">
        <Form.Field
          control={form.control}
          name="name"
          render={({ field }) => (
            <Form.Item className="flex-1">
              <Form.Label>Name</Form.Label>
              <Form.Control>
                <Input {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Form.Field
          control={form.control}
          name="subOf"
          render={({ field }) => (
            <Form.Item className="flex-1">
              <Form.Label>Parent Segment</Form.Label>
              <Form.Control>
                <SelectSegmentCommand
                  exclude={segment?._id ? [segment._id] : undefined}
                  selected={field.value}
                  onSelect={(value) => {
                    field.onChange(field.value === value ? null : value);
                  }}
                />
              </Form.Control>
            </Form.Item>
          )}
        />
      </div>

      <Form.Field
        control={form.control}
        name="description"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Description</Form.Label>
            <Form.Control>
              <Textarea {...field} />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
    </div>
  );
};

export default function SegmentForm({
  contentType,
  isTempoaray,
  callback,
  segmentId,
}: Props) {
  const [stats, setStats] = useState<StatsType>();
  const [countSegment, { called, loading }] = useLazyQuery(
    queries.segmentsPreviewCount,
  );
  const [segmentAdd] = useMutation(mutations.segmentsAdd);
  const [segmentsEdit] = useMutation(mutations.segmentsEdit);
  const { toast } = useToast();

  const {
    data,
    loading: segmentLoading,
    refetch,
  } = useQuery<{
    segmentDetail: ISegment;
  }>(queries.segmentDetail, {
    variables: { _id: segmentId },
    skip: !segmentId || !contentType,
  });

  const segment = data?.segmentDetail;

  const form = useForm<z.infer<typeof segmentFormSchema>>({
    resolver: zodResolver(segmentFormSchema),
    defaultValues: getDefaultValues(contentType, segment || {}, isTempoaray),
    values: getDefaultValues(contentType, segment || {}, isTempoaray),
  });

  useEffect(() => {
    refetch();
  }, [segmentId]);

  const onAddSegmentGroup = () => {
    if (!contentType) {
      return toast({
        title: 'Content type is not selected',
        color: 'bg-red-500/50 text-red-500',
      });
    }

    const conditions = form.getValues('conditions');
    const subSegments = form.getValues('conditionSegments');
    const hasSubSegments = (subSegments || [])?.length > 0;

    if (!hasSubSegments) {
      form.setValue('conditionSegments', [
        {
          contentType: contentType,
          conditionsConjunction: 'and',
          conditions,
        },
        {
          contentType: contentType,
          conditionsConjunction: 'and',
          conditions: [
            {
              propertyType: contentType,
              propertyName: '',
              propertyOperator: '',
            },
          ],
        },
      ]);
      form.setValue('conditions', []);
      return;
    }
    form.setValue('conditionSegments', [
      ...(subSegments || []),
      {
        contentType: contentType,
        conditionsConjunction: 'and',
        conditions: [
          {
            propertyType: contentType,
            propertyName: '',
            propertyOperator: '',
          },
        ],
      },
    ]);
  };

  const handleSave = (data: z.infer<typeof segmentFormSchema>) => {
    const mutation = segment ? segmentsEdit : segmentAdd;
    mutation({
      variables: {
        ...data,
        contentType: contentType,
        shouldWriteActivityLog: false,
        _id: segment ? segment?._id : undefined,
      },
      onError: (e: ApolloError) => {
        toast({
          title: 'Error',
          description: e.message,
        });
      },
      onCompleted: (data) => {
        const { segmentsAdd, segmentsEdit } = data || {};
        const { _id } = segmentsAdd || segmentsEdit || {};
        form.reset();
        // setOpen(false);
        toast({
          title: `${segment ? 'Edited' : 'Created'} successfully`,
        });
        callback && callback(_id);
        refetch();
      },
    });
  };

  const handleCalculateStats = async () => {
    const { data } = await countSegment({
      query: queries.segmentsPreviewCount,
      variables: {
        contentType: contentType,
        conditions: generateParamsPreviewCount(form, contentType || ''),
        subOf: form.getValues('subOf'),
        config: form.getValues('config'),
        conditionsConjunction: form.getValues('conditionsConjunction'),
      },
    });

    const { count = 0, total = 0 } = data?.segmentsPreviewCount || {};
    setStats({
      total,
      targeted: count,
      percentage: total > 0 ? Number(((count / total) * 100).toFixed(2)) : 0,
    });
  };

  if (segmentLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="flex flex-col flex-1 max-h-full px-8 pt-4 pb-4 overflow-y-auto w-2xl">
        <FormProvider {...form}>
          <SegmentMetadataForm
            form={form}
            segment={segment}
            isTemporary={isTempoaray}
          />
          <div className="py-4">{renderContent({ form, contentType })}</div>
          <Button
            variant="secondary"
            className="w-full"
            onClick={onAddSegmentGroup}
          >
            <Form.Label>+ Add Group</Form.Label>
          </Button>
          <Form.Message />
        </FormProvider>
      </div>

      {!!stats && (
        <Sheet.Footer className="gap-4 sm:justify-start border-y-2 px-6 py-4">
          <div className="flex flex-col items-center">
            <Label>Total</Label>
            <h4 className="text-xl text-primary">
              {stats?.total?.toLocaleString()}
            </h4>
          </div>
          <div className="flex flex-col items-center">
            <Label>Targeted</Label>
            <h4 className="text-xl text-primary">
              {stats?.targeted?.toLocaleString()}
            </h4>
          </div>
          <div className="flex flex-col items-center">
            <Label>Percentage</Label>
            <h4 className="text-xl text-primary">{stats?.percentage}%</h4>
          </div>
        </Sheet.Footer>
      )}
      <Sheet.Footer className="m-4 ">
        <Button
          variant="secondary"
          onClick={handleCalculateStats}
          disabled={loading && called}
        >
          {loading && called ? 'Calculating...' : 'Calculate segment reach'}
        </Button>
        <Button
          onClick={form.handleSubmit(handleSave, (error) =>
            // alert({
            //   title: 'Something went wrong',
            //   description: Object.values(error)[0].message?.toString(),
            // }),
            console.log(error),
          )}
        >
          Save Segment
        </Button>
      </Sheet.Footer>
    </>
  );
}
