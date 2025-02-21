import React, { useEffect, useMemo } from 'react';
import { useMailConfigForm } from '../hooks/useMailConfigForm';
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
} from 'erxes-ui/components';
import { mailConfigFields } from '../constants/formData';
import { TMailConfigForm } from '../types';
import { Path } from 'react-hook-form';
import { cn } from 'erxes-ui/lib';
import { AnimatePresence } from 'framer-motion';
import { useConfig } from '@/settings/file-upload/hook/useConfigs';
import { IconLoader2 } from '@tabler/icons-react';

const MailConfigForm = () => {
  const {
    methods: { control },
    methods,
    submitHandler,
    COMPANY_EMAIL_TEMPLATE_TYPE,
  } = useMailConfigForm();
  const { isLoading, configs } = useConfig();

  const mailService = useMemo(() => {
    return {
      type: methods.watch('DEFAULT_EMAIL_SERVICE'),
    };
  }, [methods.watch()]);

  useEffect(() => {
    if (configs !== undefined) {
      const values = configs.reduce((acc: any, config: any) => {
        acc[config.code] = config.value;
        return acc;
      }, {});

      methods.reset({
        ...values,
      });
    }
  }, [configs, methods]);

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(submitHandler)}
        className="grid grid-cols-4 gap-3 py-1"
      >
        {mailConfigFields['common'].map(
          ({ name, inputType, type, label, description, options }, idx) => {
            if (inputType === 'select') {
              return (
                <FormField
                  key={name}
                  control={control}
                  name={name as Path<TMailConfigForm>}
                  render={({ field }) => (
                    <FormItem
                      className={cn(
                        idx === 1 ? 'col-span-2' : 'col-span-4',
                        'flex flex-col justify-between',
                      )}
                    >
                      <div>
                        <FormLabel>{label}</FormLabel>
                        <FormDescription>{description}</FormDescription>
                      </div>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <Select.Trigger
                            className={cn(idx === 1 && 'capitalize', 'h-7')}
                          >
                            <Select.Value placeholder={'Select type'} />
                          </Select.Trigger>
                        </FormControl>
                        <Select.Content>
                          {options?.map((opt) => (
                            <Select.Item key={opt} value={opt}>
                              {opt}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
              );
            } else if (inputType === 'editor') {
              if (COMPANY_EMAIL_TEMPLATE_TYPE === 'simple') {
                return (
                  <FormField
                    key={name}
                    control={control}
                    name={name as Path<TMailConfigForm>}
                    render={({ field }) => (
                      <FormItem
                        className={cn(
                          idx === 0 ? 'col-span-2' : 'col-span-4',
                          'flex flex-col justify-between',
                        )}
                      >
                        <div>
                          <FormLabel>{label}</FormLabel>
                        </div>
                        <div className="w-full px-1 py-2 text-sm bg-primary-foreground/75 text-primary border border-l-4 border-primary/75">
                          {description}
                        </div>
                      </FormItem>
                    )}
                  />
                );
              } else {
                return (
                  <FormField
                    key={name}
                    control={control}
                    name={name as Path<TMailConfigForm>}
                    render={({ field }) => (
                      <FormItem
                        className={cn(
                          idx === 0 ? 'col-span-2' : 'col-span-4',
                          'flex flex-col justify-between',
                        )}
                      >
                        <div>
                          <FormLabel>{label}</FormLabel>
                        </div>
                        <div className="w-full rounded-lg bg-background text-primary">
                          {description}
                        </div>
                      </FormItem>
                    )}
                  />
                );
              }
            }
            return (
              <FormField
                key={name}
                control={control}
                name={name as Path<TMailConfigForm>}
                render={({ field }) => (
                  <FormItem
                    className={cn(
                      idx === 0 ? 'col-span-2' : 'col-span-4',
                      'flex flex-col justify-between',
                    )}
                  >
                    <div>
                      <FormLabel>{label}</FormLabel>
                      <FormDescription>{description}</FormDescription>
                    </div>
                    <FormControl>
                      <Input type={type} {...field} className="h-7" />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
            );
          },
        )}
        <AnimatePresence mode="popLayout">
          {mailConfigFields[mailService.type]?.map(
            ({ name, inputType, type, label, description, options }, idx) => (
              <FormField
                key={name}
                control={control}
                name={name as Path<TMailConfigForm>}
                render={({ field }) => (
                  <FormItem
                    className={cn(
                      methods.watch('DEFAULT_EMAIL_SERVICE') === 'custom' &&
                        'last-of-type:col-span-4',
                      'flex flex-col justify-between col-span-2 last-of-type:col-span-2',
                    )}
                  >
                    <div>
                      <FormLabel>{label}</FormLabel>
                      <FormDescription>{description}</FormDescription>
                    </div>
                    <FormControl>
                      <Input type={type} {...field} className="h-7" />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
            ),
          )}
        </AnimatePresence>
        <FormItem className="col-span-4 grid grid-cols-4">
          <Button
            size={'sm'}
            type="submit"
            className="w-full col-span-1 col-start-4"
          >
            {isLoading ? <IconLoader2 className="animate-spin" /> : 'Update'}
          </Button>
        </FormItem>
      </form>
    </Form>
  );
};

export { MailConfigForm };
