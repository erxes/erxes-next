import { INTEGRATIONS } from '@/integrations/constants/integrations';
import { AddErxesMessengerSheet } from '@/integrations/erxes-messenger/components/AddErxesMessenger';
import { IconChevronLeft, IconPlus } from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import { Link, useParams } from 'react-router';

export const IntegrationDetailPage = () => {
  const { integrationType } = useParams();

  const integration = INTEGRATIONS.find(
    (integration) => integration.type === integrationType,
  );

  return (
    <div className="mx-auto p-5 w-full max-w-5xl flex flex-col gap-8">
      <div>
        <Button variant="ghost" className="text-muted-foreground" asChild>
          <Link to="/settings/inbox/integrations">
            <IconChevronLeft />
            Integrations
          </Link>
        </Button>
      </div>
      <div className="space-y-5">
        <div className="flex gap-2">
          <div className="size-8 rounded overflow-hidden shadow-sm">
            <img
              src={integration?.img}
              alt={integration?.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h6 className="font-semibold text-sm">{integration?.name}</h6>
            <span className="text-sm text-muted-foreground font-medium">
              {integration?.description}
            </span>
          </div>
        </div>
        <AddErxesMessengerSheet />
      </div>
      <div>
        <h2 className="text-lg font-semibold">
          8 {integration?.name} integrations
        </h2>
      </div>
    </div>
  );
};
