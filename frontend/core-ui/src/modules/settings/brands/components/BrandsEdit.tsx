import {
  IconChessKnight,
  IconLayoutSidebarLeftCollapse,
} from '@tabler/icons-react';
import { Button, Form, Sheet, useQueryState, useToast } from 'erxes-ui';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBrandsForm } from '../hooks/useBrandsForm';
import { SubmitHandler } from 'react-hook-form';
import { BrandsForm } from './BrandsForm';
import { useBrandsEdit } from '../hooks/useBrandsEdit';
import { TBrandsForm } from '../types';

export const BrandsEdit = () => {
  const {
    methods,
    methods: { reset, handleSubmit },
  } = useBrandsForm();
  const { handleEdit, loading: isLoading } = useBrandsEdit();
  const { toast } = useToast();

  const [searchParams, setSearchParams] = useSearchParams();
  const [brandId] = useQueryState('brand_id');

  const setOpen = (newBrandId: string | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (newBrandId) {
      newSearchParams.set('brand_id', newBrandId);
    } else {
      newSearchParams.delete('brand_id');
    }
    setSearchParams(newSearchParams);
  };
  const submitHandler: SubmitHandler<TBrandsForm> = React.useCallback(
    async (data) => {
      console.log('data', data);
      handleEdit({
        variables: {
          id: brandId,
          ...data,
        },
        onCompleted: () => {
          toast({ title: 'Success!' });
          methods.reset();
          setOpen(null);
        },
        onError: (error) =>
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          }),
      });
    },
    [handleEdit],
  );

  return (
    <Sheet
      open={!!brandId}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          reset();
          setOpen(null);
        }
      }}
    >
      <Sheet.View className="p-0">
        <Form {...methods}>
          <form
            className="flex flex-col gap-0 size-full"
            onSubmit={handleSubmit(submitHandler)}
          >
            <Sheet.Header>
              <IconChessKnight />
              <Sheet.Title>Create brand</Sheet.Title>
              <Sheet.Close />
            </Sheet.Header>
            <Sheet.Content className="grow size-full flex flex-col px-5 py-4">
              <BrandsForm />
            </Sheet.Content>
            <Sheet.Footer>
              <Button variant={'secondary'}>Cancel</Button>
              <Button type="submit">Update</Button>
            </Sheet.Footer>
          </form>
        </Form>
      </Sheet.View>
    </Sheet>
  );
};
