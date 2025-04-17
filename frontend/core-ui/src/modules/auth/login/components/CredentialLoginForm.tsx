import { useCallback } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Button, Form, Input } from 'erxes-ui';
import { useLogin } from '@/auth/login/hooks/useLogin';
import { FormType, useSignInUpForm } from '@/auth/login/hooks/useLoginForm';
import { Link } from 'react-router';
import { useQueryState } from 'erxes-ui';

export const CredentialLoginForm = () => {
  const [, setEmail] = useQueryState('email')
  const { form } = useSignInUpForm();
  const { handleCrendentialsLogin } = useLogin();

  const submitHandler: SubmitHandler<FormType> = useCallback(
    async (data) => {
      handleCrendentialsLogin(data.email, data.password);
    },
    [handleCrendentialsLogin],
  );


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        className="mx-auto grid gap-5"
      >
        <Form.Field
          name="email"
          control={form.control}
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Email</Form.Label>
              <Form.Control>
                <Input
                  type="email"
                  placeholder="Enter your work email"
                  {...field}
                />
              </Form.Control>
            </Form.Item>
          )}
        />

        <Form.Field
          name="password"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Password</Form.Label>
              <Form.Control>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </Form.Control>
            </Form.Item>
          )}
        />
        <Button type="submit" className={`h-8`}>
          Sign in
        </Button>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="link"
            className=" hover:bg-transparent h-min w-min text-muted-foreground hover:underline text-center block hover:text-primary "
          asChild
          >
            <Link to={`/forgot-password${form.getValues('email') ? `?email=${form.getValues('email')}` : ''}`}>
            Forgot password?</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};
