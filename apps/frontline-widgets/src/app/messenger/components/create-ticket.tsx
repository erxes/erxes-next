import { FormProvider } from 'react-hook-form';
import { useTicketsForm } from '../hooks/useTicketsForm';
import { TicketsFormData } from '../types';
import { TicketForm } from './ticket-form';

export const CreateTicket = () => {
  const form = useTicketsForm();
  const submitHandler = (data: TicketsFormData) => {
    console.log('submitted!');
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        className="flex flex-col size-full p-4 min-h-[300px]"
      >
        <TicketForm form={form} />
      </form>
    </FormProvider>
  );
};
