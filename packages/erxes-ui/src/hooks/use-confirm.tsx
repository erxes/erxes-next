import { useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Form,
  FormControl,
  FormMessage,
  FormField,
  FormItem,
  Input,
  FormLabel,
} from 'erxes-ui/components';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type OptionProps = {
  okLabel?: string;
  cancelLabel?: string;
  description?: string;
  confirmationValue?: string;
};

type ConfirmDialogProp = {
  message: string;
  options?: OptionProps;
  open: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
};

export const confirmValidationSchema = z
  .object({
    confirm: z.string(),
  })
  .required();

export type FormType = z.infer<typeof confirmValidationSchema>;

const ConfirmDialog = ({
  message,
  options,
  open,
  onConfirm,
  onDismiss,
}: ConfirmDialogProp) => {
  const {
    okLabel = 'Confirm',
    cancelLabel = 'Cancel',
    description = '',
    confirmationValue = '',
  } = options || ({} as OptionProps);

  const form = useForm<FormType>({
    mode: 'onBlur',
    defaultValues: {
      confirm: '',
    },
    resolver: zodResolver(confirmValidationSchema),
  });

  const dismiss = () => {
    onDismiss();
  };

  const proceed: SubmitHandler<FormType> = () => {
    const { confirm } = form.getValues();

    if (confirmationValue) {
      if (confirm === confirmationValue) {
        return onConfirm();
      }

      return form.setError(
        'confirm',
        { type: 'custom', message: `Enter ${confirmationValue} to confirm` },
        { shouldFocus: true }
      );
    }

    return onConfirm();
  };

  const renderConfirm = (form) => {
    if (!confirmationValue) {
      return null;
    }

    return (
      <>
        <FormField
          name="confirm"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">
                Type <strong>{confirmationValue}</strong> in the field below to
                confirm.
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter confirmation"
                  {...field}
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    );
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <Form {...form}>
          <AlertDialogHeader>
            <AlertDialogTitle>{message}</AlertDialogTitle>
            {description && (
              <AlertDialogDescription> {description} </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <form onSubmit={form.handleSubmit(proceed)}>
            {renderConfirm(form)}
            <br />
            <AlertDialogFooter>
              <AlertDialogCancel onClick={dismiss} type="button">
                {cancelLabel}
              </AlertDialogCancel>
              <AlertDialogAction type="submit">{okLabel}</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const useConfirm = () => {
  const confirm = useCallback(
    ({ message, options }: { message: string; options?: OptionProps }) => {
      return new Promise<void>((resolve) => {
        const wrapper = document.createElement('div');
        document.body.appendChild(wrapper);

        let isOpen = true;

        const cleanup = () => {
          if (!isOpen) return;

          isOpen = false;

          try {
            root.unmount();
          } catch (error) {
            console.error('Error unmounting confirm dialog:', error);
          } finally {
            wrapper.parentNode?.removeChild(wrapper);
          }
        };

        const handleConfirm = () => {
          resolve();
          cleanup();
        };

        const handleDismiss = () => {
          cleanup();
        };

        const root = createRoot(wrapper);
        root.render(
          <ConfirmDialog
            message={message}
            options={options}
            open={true}
            onConfirm={handleConfirm}
            onDismiss={handleDismiss}
          />
        );
      });
    },
    []
  );

  return { confirm };
};

export { useConfirm };
