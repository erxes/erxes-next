import { useLoginMagicLink } from '@/auth/login/hooks/useLoginMagicLink';
import { IconBrandGoogleFilled } from '@tabler/icons-react';
import { Button, Card, Form, Input, Label } from 'erxes-ui';

export const MagicLinkLoginForm = () => {
  const { form, onMagicLinkSubmit, onGoogleLogin } = useLoginMagicLink();

  return (
    <Form {...form}>
      <form onSubmit={onMagicLinkSubmit} className="mx-auto grid gap-5">
        <Card.Description className="text-center text-accent-foreground font-medium">
          We use magic link so you don't have to remember or type in yet another
          long password
        </Card.Description>
        <Form.Field
          name="email"
          control={form.control}
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Email</Form.Label>
              <Form.Message />
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

        <Button type="submit" className={`h-8`}>
          Continue
        </Button>
        <Label className="text-center">OR</Label>
        <Button variant="link" onClick={onGoogleLogin}>
          <IconBrandGoogleFilled />
          Continue with Google
        </Button>
        {/* disabled until the backend is ready */}
        {/* <Card.Description className="text-center">or</Card.Description>
        <GoogleOAuthButton /> */}
      </form>
    </Form>
  );
};
