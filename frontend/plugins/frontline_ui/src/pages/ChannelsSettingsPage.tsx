import { PageSubHeader } from 'erxes-ui';
import { ChannelsFilter } from '~/modules/settings/components/channels/ChannelsFilter';
import { ChannelsSettings } from '~/modules/settings/components/ChannelsSettings';

const ChannelsSettingsPage = () => {
  return (
    <div className="w-full overflow-hidden flex flex-col">
      <ChannelsFilter />
      <ChannelsSettings />
    </div>
  );
};

export default ChannelsSettingsPage;
