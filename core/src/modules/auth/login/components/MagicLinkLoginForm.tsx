import { SubmitHandler, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button, Card,Form, FormControl, FormField, FormItem, Input } from 'erxes-ui/components';

import { GoogleOAuthButton } from './GoogleOAuthButton';

const emailValidationSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type FormType = z.infer<typeof emailValidationSchema>;

export const MagicLinkLoginForm = () => {
  const form = useForm<FormType>({
    resolver: zodResolver(emailValidationSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const submitHandler: SubmitHandler<FormType> = (data) => {
    console.log('Submitted email:', data.email);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        className="mx-auto grid w-[350px] gap-5"
      >
        <Card.Description className='text-center'>We use magic link so you don't have to remember or type in yet another long password</Card.Description>
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <span className="font-semibold text-sm">Email</span>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className={!form.formState.isValid ? "cursor-not-allowed" : ""}>
          Continue
        </Button>
        <Card.Description className='text-center'>or</Card.Description>
       <GoogleOAuthButton />
      </form>
    </Form>
  );
};
