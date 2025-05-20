import { PageSubHeader } from 'erxes-ui';
import { ChannelsFilter } from '~/modules/settings/components/channels/ChannelsFilter';
import { ChannelsSettings } from '~/modules/settings/components/ChannelsSettings';

const ChannelsSettingsPage = () => {
  return (
    <div className="flex flex-col h-full overflow-auto">
      <PageSubHeader>
        <ChannelsFilter />
      </PageSubHeader>
      <ChannelsSettings />
    </div>
  );
};

export default ChannelsSettingsPage;
