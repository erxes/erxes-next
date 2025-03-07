import { SubmitHandler, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button, Card, Form, Input } from 'erxes-ui/components';

import { GoogleOAuthButton } from '@/auth/login/components/GoogleOAuthButton';

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
        className="mx-auto grid gap-5"
      >
        <Card.Description className="text-center">
          We use magic link so you don't have to remember or type in yet another
          long password
        </Card.Description>
        <Form.Field
          name="email"
          control={form.control}
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Email</Form.Label>
              <Form.Control>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-8"
                  {...field}
                />
              </Form.Control>
            </Form.Item>
          )}
        />

        <Button
          type="submit"
          className={`${
            !form.formState.isValid ? 'cursor-not-allowed' : ''
          } h-8`}
        >
          Continue
        </Button>
        <Card.Description className="text-center">or</Card.Description>
        <GoogleOAuthButton />
      </form>
    </Form>
  );
};
