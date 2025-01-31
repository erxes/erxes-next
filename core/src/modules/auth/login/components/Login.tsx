import { Card, Tabs } from "erxes-ui/components";

import { CredentialLoginForm } from "./CredentialLoginForm";
import { MagicLinkLoginForm } from "./MagicLinkLoginForm";

import { Logo } from "@/auth/components/Logo";

export const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center pt-16">
      <Logo className="mb-6" />
      <Card className="p-4 shadow-sm shadow-muted-foreground border w-full max-w-md">
        <Card.Header className="flex items-center">
          <Card.Title>Welcome</Card.Title>
          <Card.Description>
            Please sign in to your account to continue
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Tabs defaultValue="credential" className="flex flex-col gap-8">
            <Tabs.List className="grid grid-cols-2 p-1 bg-transparent">
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
            <Tabs.Content value="magic-link">
              <MagicLinkLoginForm />
            </Tabs.Content>
            <Tabs.Content value="credential">
              <CredentialLoginForm />
            </Tabs.Content>
          </Tabs>
        </Card.Content>
        <Card.Footer className="flex flex-col text-muted-foreground">
          <span className="text-sm font-medium text-center">
            By signing in, you confirm that you accept our
          </span>
          <span className="text-sm font-medium text-center">
            <a className="text-primary font-semibold" href="#">Terms of use</a>
            {" "}and{" "}
            <a className="text-primary font-semibold" href="#">Privacy policy</a>
          </span>
        </Card.Footer>
      </Card>
      <Card.Description className="mt-auto py-4">© 2024 erxes</Card.Description>
    </div>
  );
};