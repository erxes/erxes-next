import React from 'react';
import { Button } from 'erxes-ui';
import { IconChevronLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import { IntegrationHeader } from './IntegrationHeader';
import { IntegrationsList } from './IntegrationsList';

export const IntegrationSettings = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl flex flex-col gap-8 h-full w-full mx-auto">
      <div className="px-6 py-4">
        <Button
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => navigate(-1)}
        >
          <IconChevronLeft />
          Integrations
        </Button>
      </div>
      <IntegrationHeader />
      <IntegrationsList />
    </div>
  );
};
