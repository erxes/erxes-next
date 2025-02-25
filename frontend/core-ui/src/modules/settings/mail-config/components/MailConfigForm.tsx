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
import { MAIL_CONFIG_FIELDS } from '../constants/formData';
import { TMailConfigForm } from '../types';
import { Path, useWatch } from 'react-hook-form';
import { cn } from 'erxes-ui/lib';
import { AnimatePresence } from 'framer-motion';
import { useConfig } from '@/settings/file-upload/hook/useConfigs';
import {
  IconAlertTriangle,
  IconAlertTriangleFilled,
  IconLoader2,
} from '@tabler/icons-react';

const MailConfigForm = () => {
  const {
    methods: { control },
    methods,
    submitHandler,
  } = useMailConfigForm();
  const { isLoading, configs } = useConfig();
  const COMPANY_EMAIL_TEMPLATE_TYPE = useWatch({
    control,
    name: 'COMPANY_EMAIL_TEMPLATE_TYPE',
  });
  const MAIL_SERVICE = useWatch({ control, name: 'DEFAULT_EMAIL_SERVICE' });

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
        {MAIL_CONFIG_FIELDS['common'].map(
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
                      <FormMessage className="text-destructive" />
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
                        <div className="w-full flex items-center p-3 text-[13px] leading-[140%] font-normal bg-primary/[.06] text-primary rounded-lg border border-primary/30">
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
                        <div className="w-full flex items-center p-3 text-[13px] leading-[140%] font-normal bg-primary/[.06] text-primary rounded-lg border border-primary/30">
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
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
            );
          },
        )}
        <AnimatePresence mode="popLayout">
          {MAIL_CONFIG_FIELDS[MAIL_SERVICE]?.map(
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
                    <FormMessage className="text-destructive" />
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
