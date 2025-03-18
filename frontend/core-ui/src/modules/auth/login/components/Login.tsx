import { Card, Tabs, cn } from 'erxes-ui';
import { CredentialLoginForm } from '@/auth/login/components/CredentialLoginForm';
import { MagicLinkLoginForm } from '@/auth/login/components/MagicLinkLoginForm';
import { Logo } from '@/auth/components/Logo';
export const Login = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'min-h-screen flex flex-col items-center justify-between p-4',
        className,
      )}
    >
      <div className="w-11/12 sm:w-7/12 md:w-8/12 lg:w-6/12 flex flex-col items-center pt-8 md:pt-16">
        <Logo className="mb-4 md:mb-6" />
        <Card className="w-full shadow-sixteen border-none shadow-muted-foreground flex flex-col">
          <div className="w-full h-full border-b border-border rounded-xl">
            <Card.Header className="flex flex-col items-center p-3">
              <Card.Title className="mt-2 md:mt-3 mb-1">Welcome</Card.Title>
              <Card.Description className="text-center">
                Please sign in to your account to continue
              </Card.Description>
            </Card.Header>
            <Card.Content className="flex-grow p-3 md:p-4">
              <Tabs
                defaultValue="credential"
                className="flex flex-col h-full px-1 md:px-2"
              >
                <Tabs.List className="grid grid-cols-2 p-1 bg-muted mb-3 md:mb-4 h-full">
                  <Tabs.Trigger
                    value="magic-link"
                    className="data-[state=active]:shadow-button-outline h-7"
                  >
                    Magic link
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="credential"
                    className="data-[state=active]:shadow-button-outline h-7"
                  >
                    Email & password
                  </Tabs.Trigger>
                </Tabs.List>
                <div className="flex-grow">
                  <Tabs.Content value="magic-link" className="h-full">
                    <MagicLinkLoginForm />
                  </Tabs.Content>
                  <Tabs.Content value="credential" className="h-full">
                    <CredentialLoginForm />
                  </Tabs.Content>
                </div>
              </Tabs>
            </Card.Content>
          </div>
          <Card.Footer className="flex flex-col text-muted-foreground p-3 md:p-4 space-y-1">
            <span className="text-xs sm:text-sm font-medium text-center">
              By signing in, you confirm that you accept our
            </span>
            <span className="text-xs sm:text-sm font-medium text-center">
              <a
                className="text-primary font-semibold hover:underline"
                href="#"
              >
                Terms of use
              </a>{' '}
              and{' '}
              <a
                className="text-primary font-semibold hover:underline"
                href="#"
              >
                Privacy policy
              </a>
            </span>
          </Card.Footer>
        </Card>
      </div>
      <Card.Description className="py-3 md:py-4">© 2024 erxes</Card.Description>
    </div>
  );
};
