import { IconSearch } from '@tabler/icons-react';
import { Card, Command, Input } from 'erxes-ui';
import { INTEGRATIONS } from '../constants/integrations';
import { Link } from 'react-router-dom';
import { IntegrationLogo } from './IntegrationLogo';
import { IntegrationType } from '@/types/Integration';

export const IntegrationList = () => {
  return (
    <Command>
      <div className="relative m-1 mb-8">
        <Command.Primitive.Input placeholder="Search integrations" asChild>
          <Input className="pl-8" placeholder="Search integrations" />
        </Command.Primitive.Input>
        <div className="absolute left-2 top-1/2 -translate-y-1/2">
          <IconSearch className="size-4 text-accent-foreground" />
        </div>
      </div>
      <Command.List className="p-0">
        <Command.Group
          heading="Integrations"
          className="[&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:mb-1.5 pb-8"
        >
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(INTEGRATIONS).map(
              ([integrationType, integration]) => (
                <IntegrationCard
                  key={integrationType}
                  integration={integration}
                  integrationType={integrationType as IntegrationType}
                />
              ),
            )}
          </div>
        </Command.Group>
      </Command.List>
    </Command>
  );
};

export const IntegrationCard = ({
  integration,
  integrationType,
}: {
  integration: (typeof INTEGRATIONS)[keyof typeof INTEGRATIONS];
  integrationType: IntegrationType;
}) => {
  return (
    <Link to={`/settings/inbox/integrations/${integrationType}`}>
      <Command.Primitive.Item asChild key={integrationType}>
        <Card className="h-full p-3 flex flex-col gap-2 rounded-lg">
          <IntegrationIntro integration={integration} />
        </Card>
      </Command.Primitive.Item>
    </Link>
  );
};

export const IntegrationIntro = ({
  integration,
}: {
  integration?: (typeof INTEGRATIONS)[keyof typeof INTEGRATIONS];
}) => {
  if (!integration) {
    return null;
  }

  return (
    <>
      <div className="flex gap-2">
        <IntegrationLogo img={integration.img} name={integration.name} />
        <h6 className="font-semibold text-sm self-center">
          {integration.name}
        </h6>
        <div className="text-xs text-muted-foreground font-mono ml-auto">
          (0)
        </div>
      </div>
      <div className="text-sm text-muted-foreground font-medium">
        {integration.description}
      </div>
    </>
  );
};
