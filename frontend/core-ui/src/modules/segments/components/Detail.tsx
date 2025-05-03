import { zodResolver } from '@hookform/resolvers/zod';
import { IconPlus } from '@tabler/icons-react';
import { Form, useQueryState, useToast } from 'erxes-ui';
import {
  Button,
  Input,
  Label,
  MultipleSelector,
  Sheet,
  Spinner,
  Textarea,
} from 'erxes-ui/components';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { ISegment, ListQueryResponse } from '../types';
import { getDefaultValues } from './form/defaultValues';
import formSchema from './form/schema';
import Segment from './form/Segment';
import { Segments } from './form/Segments';
import {
  ApolloError,
  ApolloQueryResult,
  OperationVariables,
  useMutation,
  useQuery,
} from '@apollo/client';
import mutations from '../graphql/mutations';
import queries from '../graphql/queries';
import { useState } from 'react';
import { SelectSegmentCommand } from '../common/SelectSegment';

type Props = {
  trigger?: React.ReactNode;
  refetch: (
    variables?: Partial<OperationVariables> | undefined,
  ) => Promise<ApolloQueryResult<ListQueryResponse>>;
};

const renderContent = ({
  segment,
  form,
}: {
  segment?: ISegment;
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const conditionSegments = form.watch('conditionSegments');

  if (conditionSegments?.length) {
    return <Segments form={form} />;
  }

  return <Segment form={form} />;
};

const renderStats = () => {
  console.log('dasdas');
  return (
    <Sheet.Footer className="gap-4 sm:justify-start border-y-2 px-6 py-4">
      <div className="flex flex-col items-center">
        <Label>Total</Label>
        <h4 className="text-xl text-primary">1000000</h4>
      </div>
      <div className="flex flex-col items-center">
        <Label>Targeted</Label>
        <h4 className="text-xl text-primary">52503</h4>
      </div>
      <div className="flex flex-col items-center">
        <Label>Percentage</Label>
        <h4 className="text-xl text-primary">52%</h4>
      </div>
    </Sheet.Footer>
  );
};

export default function SegmentDetail({ refetch }: Props) {
  const [selectedContentType] = useQueryState<string>('contentType');

  if (!selectedContentType) {
    return null;
  }

  const [segmentId, setOpen] = useQueryState<string>('segmentId');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isDisplayStats, setDisplayStats] = useState(false);

  const { toast } = useToast();
  const [segmentAdd] = useMutation(mutations.segmentsAdd);
  const [segmentsEdit] = useMutation(mutations.segmentsEdit);
  let segment: ISegment | undefined;

  const { data, loading: segmentLoading } = useQuery(queries.segmentDetail, {
    variables: { _id: segmentId },
    skip: !segmentId || !selectedContentType,
  });

  if (data?.segmentDetail) {
    segment = data.segmentDetail;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(selectedContentType, segment || {}),
    values: getDefaultValues(selectedContentType, segment || {}),
  });

  const onAddSegmentGroup = () => {
    if (!selectedContentType) {
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
          contentType: selectedContentType,
          conditionsConjunction: 'and',
          conditions,
        },
        {
          contentType: selectedContentType,
          conditionsConjunction: 'and',
          conditions: [
            {
              propertyType: selectedContentType,
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
        contentType: selectedContentType,
        conditionsConjunction: 'and',
        conditions: [
          {
            propertyType: selectedContentType,
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
        contentType: selectedContentType,
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
        refetch();
      },
    });
  };

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

      <Sheet.Content
        className="p-0 md:max-w-screen-lg"
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <div className="h-full flex flex-col">
          <Sheet.Header className="border-b p-3 flex-row items-center space-y-0 gap-3">
            <Sheet.Title>{`${
              segment ? 'Edit' : 'Create'
            } a segment`}</Sheet.Title>
            <Sheet.Close />
          </Sheet.Header>
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
                            field.onChange(
                              field.value === value ? null : value,
                            );
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
              <div className="py-4 ">{renderContent({ segment, form })}</div>
              <Button
                variant="secondary"
                className="w-full"
                onClick={onAddSegmentGroup}
              >
                <Form.Label>+ Add Group</Form.Label>
              </Button>
            </FormProvider>
          </div>
          {isDisplayStats && renderStats()}
          <Sheet.Footer className="m-4 ">
            <Button variant="secondary" onClick={() => setDisplayStats(true)}>
              Calculate segment reach
            </Button>
            <Button onClick={form.handleSubmit(handleSave)}>
              Save Segment
            </Button>
          </Sheet.Footer>
        </div>
      </Sheet.Content>
    </Sheet>
  );
}
