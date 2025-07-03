import { useForm } from 'react-hook-form';
import { TAdjustInventoryForm } from '../types/adjustInventoryForm';
import { IconGavel, IconTrashX } from '@tabler/icons-react';
import {
  Button,
  Form,
  Input,
  Textarea,
  Spinner,
  DatePicker,
  Dialog,
  useQueryState,
} from 'erxes-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { adjustInventorySchema } from '../types/adjustInventorySchema';


export const AdjustInventoryForm = () => {
  const [id] = useQueryState<string>('id');

  const form = useForm<TAdjustInventoryForm>({
    resolver: zodResolver(adjustInventorySchema),
    defaultValues: {
      date: new Date(),
    },
  });

  const onSubmit = (data: TAdjustInventoryForm) => {
    // if (id) {
    //   updateTransaction({
    //     variables: { parentId, trDocs },
    //   });
    // } else {
    //   createTransaction({
    //     variables: { trDocs }
    //   });
    // }
  };

  const onError = (error: any) => {
    console.log(error);
  };
  return (
    <Form {...form}>
      <form
        className="p-6 flex-auto overflow-auto"
        onSubmit={form.handleSubmit(onSubmit, onError)}
      >
        <h3 className="text-lg font-bold">
          {id ? `Edit` : `Create`} Adjust Inventory
        </h3>
        <Form.Field
          control={form.control}
          name="date"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Date</Form.Label>
              <Form.Control>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  className="h-8 flex w-full"
                />
              </Form.Control>
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="description"
          render={({ field }) => (
            <Form.Item className="col-span-2">
              <Form.Label>Description</Form.Label>
              <Form.Control>
                <Textarea placeholder="Enter description" {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Button type="submit">
          <IconGavel />
          Save
        </Button>
        <Button
          variant="secondary"
          className="text-destructive"
          // onClick={handleDelete}
        >
          <IconTrashX />
          {`Delete`}
        </Button>
      </form>
    </Form>
  );

  // return (
  //   <Form {...form}>
  //     <form
  //       onSubmit={form.handleSubmit(handleSubmit)}
  //       className="py-4 grid grid-cols-2 gap-5"
  //     >


  //       <Dialog.Footer className="col-span-2 mt-4">
  //         <Dialog.Close asChild>
  //           <Button variant="outline" type="button" size="lg">
  //             Cancel
  //           </Button>
  //         </Dialog.Close>
  //         <Button type="submit" size="lg" disabled={loading}>
  //           {loading && <Spinner />}
  //           Save Account
  //         </Button>
  //       </Dialog.Footer>
  //     </form>
  //   </Form>
  // );
};
