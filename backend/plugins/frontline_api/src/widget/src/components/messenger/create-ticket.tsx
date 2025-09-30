import { useTicketsForm } from './hooks/useTicketsForm';
import { TicketsFormData } from './types';
import { TicketForm } from './ticket-form';
import { Form } from '../ui/form';

export const CreateTicket = () => {
  const form = useTicketsForm();
  const submitHandler = (data: TicketsFormData) => {
    console.log('submitted!', data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        className="flex flex-col size-full p-4 min-h-[300px]"
      >
        <TicketForm form={form} />
      </form>
    </Form>
  );
};
