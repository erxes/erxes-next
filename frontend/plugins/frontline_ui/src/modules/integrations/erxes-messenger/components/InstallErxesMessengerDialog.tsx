import { Badge, Button, Dialog, Tabs } from 'erxes-ui';
import { useAtom } from 'jotai';
import {
  erxesMessengerSetupInstallDialogOpenAtom,
  erxesMessengerSetupInstallDialogTabAtom,
} from '@/integrations/erxes-messenger/states/erxesMessengerSetupStates';
import { EMInstallDialogTab } from '@/integrations/erxes-messenger/types/EMStateTypes';
import { useIntegrationDetail } from '@/integrations/hooks/useIntegrationDetail';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import React from 'react';

export const InstallErxesMessengerDialog = () => {
  const [installId, setInstallId] = useAtom(
    erxesMessengerSetupInstallDialogOpenAtom,
  );
  return (
    <Dialog open={!!installId} onOpenChange={() => setInstallId(false)}>
      <Dialog.Content className="max-w-3xl">
        <Dialog.Header>
          <Dialog.Title>Install Erxes Messenger</Dialog.Title>
          <Dialog.Close />
        </Dialog.Header>
        <InstallErxesMessengerDialogTabs />
      </Dialog.Content>
    </Dialog>
  );
};

export const InstallErxesMessengerDialogTabs = () => {
  const [tab, setTab] = useAtom(erxesMessengerSetupInstallDialogTabAtom);
  const [id] = useAtom(erxesMessengerSetupInstallDialogOpenAtom);
  const { integrationDetail } = useIntegrationDetail({
    integrationId: id as string,
  });
  return (
    <Tabs
      value={tab}
      onValueChange={(value) => setTab(value as EMInstallDialogTab)}
    >
      <Tabs.List>
        <Tabs.Trigger value={EMInstallDialogTab.BASIC}>
          Basic JavaScript
        </Tabs.Trigger>
      </Tabs.List>
      <InstallJavaScriptCode brandId={integrationDetail?.brand?.code ?? ''} />
    </Tabs>
  );
};

export const InstallJavaScriptCode = ({ brandId }: { brandId: string }) => {
  const [copied, setCopied] = React.useState<boolean>(false);
  const cdnHost = process.env.REACT_APP_CDN_HOST || '';
  const installScript = `<script>
  window.erxesSettings = {
    messenger: {
      brand_id: "${brandId}",
    },
  };
      
  (function() {
    var script = document.createElement('script');
    script.src = "${cdnHost}/pl:frontline/widget/messengerWidget.bundle.js";
    script.async = true;
    var entry = document.getElementsByTagName('script')[0];
    entry.parentNode.insertBefore(script, entry);
  })();
</script>`;

  function handleCopy() {
    navigator.clipboard.writeText(installScript);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }
  return (
    <Tabs.Content value={EMInstallDialogTab.BASIC}>
      <Badge className="my-2 w-full">
        Paste the following code before the body tag on every page you want
        erxes widget to appear
      </Badge>
      <pre className="text-xs rounded-md border border-border p-2 text-secondary-foreground relative">
        <Button
          variant="secondary"
          size="icon"
          onClick={handleCopy}
          className="absolute right-2 top-2"
        >
          {copied ? <IconCheck /> : <IconCopy />}
        </Button>
        <code>{installScript}</code>
      </pre>
    </Tabs.Content>
  );
};
