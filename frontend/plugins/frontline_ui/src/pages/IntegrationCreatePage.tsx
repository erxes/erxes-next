import React from 'react';
import { IntegrationSettings } from '~/modules/settings/components/IntegrationSettings';

export const IntegrationCreatePage = () => {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden items-center">
      <IntegrationSettings />
    </div>
  );
};
