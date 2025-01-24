import React, { useCallback } from 'react'
import { useMailConfigForm } from '../hook/useMailConfigForm'
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, RadioGroup, Select } from 'erxes-ui/components';
import { SubmitHandler } from 'react-hook-form';
import { MailServiceFormT } from '../types';
import { MAIL_SERVICE_TYPES, MAIL_TEMPLATE_TYPES } from '../constants/data';
import { motion } from 'framer-motion';
import { cn } from 'erxes-ui/lib';
import { IconLoader2 } from '@tabler/icons-react';

const MailServiceForm = () => {
  const { form } = useMailConfigForm();

  const submitHandler: SubmitHandler<MailServiceFormT> = useCallback(
    async (data) => {
      console.log(data)
    },
    []
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)} className='grid grid-cols-6 gap-y-6'>
        <div className='grid grid-cols-2 gap-x-3 col-span-6'>
          <FormField
            name='COMPANY_EMAIL_FROM'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="COMPANY_EMAIL_TEMPLATE_TYPE"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <Select.Trigger>
                      <Select.Value placeholder="-" />
                    </Select.Trigger>
                  </FormControl>
                  <Select.Content>
                    {
                      MAIL_TEMPLATE_TYPES.map(type => (
                        <Select.Item value={type.value} key={type.value}>{type.label}</Select.Item>
                      ))
                    }
                  </Select.Content>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="DEFAULT_EMAIL_SERVICE"
          render={({ field }) => (
            <FormItem className='col-span-6'>
              <FormLabel>Default Email Service</FormLabel>
              <FormControl>
                <RadioGroup
                  role='tablist'
                  className="grid-cols-2 grid gap-3"
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  {
                    MAIL_SERVICE_TYPES.map(type => (
                      <motion.label
                        key={type.value}
                        tabIndex={0}
                        whileTap={{ scale: .975 }}
                        whileHover={{ scale: 1.0175 }}
                        className="relative flex cursor-pointer flex-col items-center gap-3 rounded-lg border border-input hover:bg-accent px-2 py-3 text-center shadow-sm shadow-black/5 outline-offset-2 transition-colors has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-primary-foreground has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring/70"
                      >
                        <RadioGroup.Item
                          id={type.value}
                          value={type.value}
                          className="sr-only after:absolute after:inset-0"
                        />
                        <type.icon className={cn(field.value === type.value ? 'stroke-primary' : 'stroke-primary/40 dark:stroke-muted-foreground', '')} />
                        <span className={cn(field.value === type.value ? 'opacity-100' : 'opacity-40', '')}>
                          {type.label}
                        </span>
                      </motion.label>
                    ))
                  }
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <motion.div whileTap={{ scale: 0.975 }} className="w-full col-start-6">
          <Button
            type="submit"
            // disabled={isLoading}
            size={'sm'}
            className="w-full"
          >
            Update
            {/* {(isLoading && <IconLoader2 className="animate-spin" />) ||
              'Update'} */}
          </Button>
        </motion.div>
      </form>
    </Form>
  )
}

export default MailServiceForm
