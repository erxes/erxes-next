import { Button, Card, Tabs } from 'erxes-ui';
import { CredentialLoginForm } from '@/auth/login/components/CredentialLoginForm';
import { MagicLinkLoginForm } from '@/auth/login/components/MagicLinkLoginForm';
export const Login = () => {
  return (
    <Card className="shadow-xl border-none p-6 mt-10 bg-background w-full">
      <div className="w-full h-full">
        <Card.Header className="flex flex-col items-center p-3">
          <Card.Title className="mt-2 md:mt-3 mb-1">Welcome</Card.Title>
          <Card.Description className="text-center text-accent-foreground">
            Please sign in to your account to continue
          </Card.Description>
        </Card.Header>
        <Card.Content className="flex-grow p-0">
          <Tabs
            defaultValue="credential"
            className="flex flex-col h-full px-1 md:px-2 shadow-none"
          >
            <Tabs.List className="grid grid-cols-2 p-1 bg-muted mb-3 md:mb-4 h-full rounded-lg border-none">
              <Tabs.Trigger asChild value="magic-link">
                <Button
                  variant={'outline'}
                  className="bg-transparent data-[state=active]:bg-background data-[state=inactive]:shadow-none"
                >
                  Magic link
                </Button>
              </Tabs.Trigger>
              <Tabs.Trigger asChild value="credential">
                <Button
                  variant={'outline'}
                  className="bg-transparent data-[state=active]:bg-background data-[state=inactive]:shadow-none"
                >
                  Email & password
                </Button>
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="magic-link" className="h-full">
              <MagicLinkLoginForm />
            </Tabs.Content>
            <Tabs.Content
              value="credential"
              className="h-full shadow-none border-none rounded-none"
            >
              <CredentialLoginForm />
            </Tabs.Content>
          </Tabs>
        </Card.Content>
      </div>
      <Card.Footer className="flex flex-col text-accent-foreground space-y-1 py-5 w-full m-0 px-0">
        <span className="text-sm font-medium text-center">
          By signing in, you confirm that you accept our
        </span>
        <span className="text-sm font-medium text-center">
          <a className="text-primary font-semibold hover:underline" href="#">
            Terms of use
          </a>
          and
          <a className="text-primary font-semibold hover:underline" href="#">
            Privacy policy
          </a>
        </span>
      </Card.Footer>
    </Card>
  );
};
