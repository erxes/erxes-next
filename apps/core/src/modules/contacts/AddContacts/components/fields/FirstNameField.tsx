import { Control } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from 'erxes-ui/components'

import { CustomerFormType } from '@/contacts/AddContacts/components/formSchema'


export const FirstNameField = ({control}: {control: Control<CustomerFormType>}) => {
  return (
    <FormField
    control={control}
    name="firstName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>FIRST NAME</FormLabel>
        <FormControl>
          <Input className="rounded-md h-8" {...field} />
        </FormControl>
        <FormMessage className="text-destructive" />
      </FormItem>
    )}
  />
  )
}