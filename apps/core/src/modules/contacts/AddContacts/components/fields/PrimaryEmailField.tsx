import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from 'erxes-ui/components';
import { Control } from 'react-hook-form'
import { CustomerFormType } from '@/contacts/AddContacts/components/formSchema'

export const PrimaryEmailField = ({control}: {control: Control<CustomerFormType>}) => {
  return (
    <FormField
    control={control}
    name="primaryEmail"
    render={({ field }) => (
      <FormItem>
        <FormLabel>EMAIL</FormLabel>
        <FormControl>
          <Input className="rounded-md h-8" {...field} />
        </FormControl>
        <FormMessage className="text-destructive" />
      </FormItem>
    )}
  />
  )
}
