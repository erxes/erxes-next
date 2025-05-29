import { IconSearch } from '@tabler/icons-react';
import { Card, Command, Input } from 'erxes-ui';
import { INTEGRATIONS } from '../constants/integrations';
import { Link } from 'react-router';

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
            {INTEGRATIONS.map((integration) => (
              <IntegrationCard
                key={integration.type}
                integration={integration}
              />
            ))}
          </div>
        </Command.Group>
      </Command.List>
    </Command>
  );
};

export const IntegrationCard = ({
  integration,
}: {
  integration: (typeof INTEGRATIONS)[0];
}) => {
  return (
    <Link to={`/settings/inbox/integrations/${integration.type}`}>
      <Command.Primitive.Item asChild key={integration.type}>
        <Card className="h-auto p-3 flex flex-col gap-2 rounded-lg">
          <IntegrationIntro integration={integration} />
        </Card>
      </Command.Primitive.Item>
    </Link>
  );
};

export const IntegrationIntro = ({
  integration,
}: {
  integration?: (typeof INTEGRATIONS)[0];
}) => {
  if (!integration) {
    return null;
  }

  return (
    <>
      <div className="flex gap-2">
        <div className="shadow-sm size-8 rounded flex-none overflow-hidden">
          <img
            src={integration.img}
            alt={integration.name}
            className="w-full h-full object-contain"
          />
        </div>
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
