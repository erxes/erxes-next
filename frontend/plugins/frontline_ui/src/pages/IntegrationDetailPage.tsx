import { IntegrationLogo } from '@/integrations/components/IntegrationLogo';
import { IntegrationsRecordTable } from '@/integrations/components/IntegrationsRecordTable';
import { INTEGRATIONS } from '@/integrations/constants/integrations';
import { IntegrationType } from '@/types/Integration';
import { IconChevronLeft } from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import { lazy, Suspense } from 'react';
import { Link, useParams } from 'react-router';

const ErxesMessengerDetail = lazy(() =>
  import('@/integrations/erxes-messenger/components/ErxesMessengerDetail').then(
    (module) => ({
      default: module.ErxesMessengerDetail,
    }),
  ),
);

const FacebookIntegrationDetail = lazy(() =>
  import('@/integrations/facebook/components/FacebookIntegrationDetail').then(
    (module) => ({
      default: module.FacebookIntegrationDetail,
    }),
  ),
);

export const IntegrationDetailPage = () => {
  const { integrationType } = useParams();

  const integration =
    INTEGRATIONS[integrationType as keyof typeof INTEGRATIONS];

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
      <div className="flex gap-2">
        <IntegrationLogo
          img={integration?.img || ''}
          name={integration?.name || ''}
        />
        <div className="flex flex-col gap-1">
          <h6 className="font-semibold text-sm">{integration?.name}</h6>
          <span className="text-sm text-muted-foreground font-medium">
            {integration?.description}
          </span>
        </div>
      </div>
      <Suspense fallback={<div />}>
        {integrationType === IntegrationType.ERXES_MESSENGER && (
          <ErxesMessengerDetail />
        )}
        {integrationType === IntegrationType.FACEBOOK_MESSENGER && (
          <FacebookIntegrationDetail />
        )}
      </Suspense>
      <IntegrationsRecordTable />
    </div>
  );
};
