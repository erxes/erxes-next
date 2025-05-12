import { ApolloError, useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, useToast } from 'erxes-ui';
import { Button, Input, Label, Sheet, Textarea } from 'erxes-ui';
import { useState } from 'react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
// import client from '~/providers/apollo-provider/apolloClient';
import { generateParamsPreviewCount } from '../common';
import { SelectSegmentCommand } from '../common/SelectSegment';
import mutations from '../graphql/mutations';
import queries from '../graphql/queries';
import { ISegment } from '../types';
import { getDefaultValues } from './defaultValues';
import formSchema, { temporarySegmentSchema } from './schema';
import Segment from './Segment';
import { Segments } from './Segments';

type Props = {
  contentType: string;
  segment?: ISegment;
  callback: () => void;
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
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const conditionSegments = form.watch('conditionSegments');

  if (conditionSegments?.length) {
    return <Segments form={form} contentType={contentType} />;
  }

  return <Segment form={form} contentType={contentType} />;
};

export default function SegmentForm({
  segment,
  contentType,
  isTempoaray,
  callback,
}: Props) {
  const [stats, setStats] = useState<StatsType>();

  const [segmentAdd] = useMutation(mutations.segmentsAdd);
  const [segmentsEdit] = useMutation(mutations.segmentsEdit);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(contentType, segment || {}, isTempoaray),
    values: getDefaultValues(contentType, segment || {}, isTempoaray),
  });
  const { toast } = useToast();
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

  const handleSave = (data: z.infer<typeof formSchema>) => {
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
      onCompleted: () => {
        form.reset();
        // setOpen(false);
        toast({
          title: `${segment ? 'Edited' : 'Created'} successfully`,
        });
        callback && callback();
      },
    });
  };

  // const handleCalculateStats = async () => {
  //   setStats({ ...stats, loading: true });
  //   const { data } = await client.query({
  //     query: queries.segmentsPreviewCount,
  //     variables: {
  //       contentType: contentType,
  //       conditions: generateParamsPreviewCount(form, contentType || ''),
  //       subOf: form.getValues('subOf'),
  //       config: form.getValues('config'),
  //       conditionsConjunction: form.getValues('conditionsConjunction'),
  //     },
  //   });

  //   const { count = 0, total = 0 } = data?.segmentsPreviewCount || {};
  //   setStats({
  //     total,
  //     targeted: count,
  //     percentage: total > 0 ? Number(((count / total) * 100).toFixed(2)) : 0,
  //     loading: false,
  //   });
  // };
  return (
    <>
      <div className="flex flex-col flex-1 max-h-full px-8 pt-4 pb-4 overflow-y-auto">
        <FormProvider {...form}>
          <div className="flex flex-row gap-4">
            {/* Name field */}
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
                  <Form.Label>Parent Id</Form.Label>
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
          <div className="py-4 ">{renderContent({ form, contentType })}</div>
          <Button
            variant="secondary"
            className="w-full"
            onClick={onAddSegmentGroup}
          >
            <Form.Label>+ Add Group</Form.Label>
          </Button>
        </FormProvider>
      </div>

      {!!stats && (
        <Sheet.Footer className="gap-4 sm:justify-start border-y-2 px-6 py-4">
          <div className="flex flex-col items-center">
            <Label>Total</Label>
            <h4 className="text-xl text-primary">
              {stats.total?.toLocaleString()}
            </h4>
          </div>
          <div className="flex flex-col items-center">
            <Label>Targeted</Label>
            <h4 className="text-xl text-primary">
              {stats.targeted?.toLocaleString()}
            </h4>
          </div>
          <div className="flex flex-col items-center">
            <Label>Percentage</Label>
            <h4 className="text-xl text-primary">{stats.percentage}%</h4>
          </div>
        </Sheet.Footer>
      )}
    </>
  );
}
