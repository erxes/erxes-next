import { Button, Collapsible } from 'erxes-ui/components';
export const ProductAddCollapsible = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Collapsible>
      <Collapsible.Trigger asChild>
        <Button variant="secondary">See more options</Button>
      </Collapsible.Trigger>
      <Collapsible.Content>{children}</Collapsible.Content>
    </Collapsible>
  );
};
