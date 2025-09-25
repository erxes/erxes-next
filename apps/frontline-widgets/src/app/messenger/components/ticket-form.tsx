import { UseFormReturn } from 'react-hook-form';
import { TicketsFormData } from '../types';

type TicketFormProps = {
  form: UseFormReturn<TicketsFormData>;
};

export function TicketForm({ form }: TicketFormProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="font-mono uppercase text-xs font-semibold text-zinc-400 mb-2">
        Your name
      </legend>
      <div className="flex gap-2">
        <input
          id="firstName"
          {...form.register('firstName')}
          placeholder="First name"
          className="rounded-[4px] ps-3 py-2 text-sm text-zinc-400 shadow-[0_0_0_1px_rgba(0,0,0,0.05)]"
        />
        <input
          id="lastName"
          {...form.register('lastName')}
          placeholder="Last name"
          className="rounded-[4px] ps-3 py-2 text-sm text-zinc-400 shadow-[0_0_0_1px_rgba(0,0,0,0.05)]"
        />
      </div>
    </fieldset>
  );
}
