import { Button } from 'erxes-ui';
import { Link } from 'react-router-dom';

export const HandlerDisplay = ({
  value,
}: {
  value: { name: string; href: string };
}) => {
  return (
    <Button variant="link" asChild>
      <Link to={value.href}>{value.name}</Link>
    </Button>
  );
};
