import { SAVE_BROWSER_INFO } from '@/components/messenger/graphql/mutations';
import { IBrowserInfo } from '@/types';
import { apolloClient } from '@/lib/apollo-client';
import React from 'react';
import { requestBrowserInfo } from '@/lib/utils';
import { useAtom, useSetAtom } from 'jotai';
import {
  browserInfoAtom,
  isBrowserInfoSavedAtom,
  lastUnreadMessageAtom,
  connectionAtom,
} from '@/components/messenger/atoms';

export const useSaveBrowserInfo = () => {
  const [connection] = useAtom(connectionAtom);
  const setBrowserInfo = useSetAtom(browserInfoAtom);
  const setIsBrowserInfoSaved = useSetAtom(isBrowserInfoSavedAtom);
  const setLastUnreadMessage = useSetAtom(lastUnreadMessageAtom);

  React.useEffect(() => {
    try {
      const saveBrowserInfo = () => {
        requestBrowserInfo({
          source: 'fromMessenger',
          callback: (browserInfo: IBrowserInfo) => {
            connection.browserInfo = browserInfo;

            const variables = {
              visitorId: connection.data.visitorId || undefined,
              customerId: connection.data.customerId || undefined,
              browserInfo,
            };

            apolloClient
              .mutate({
                mutation: SAVE_BROWSER_INFO,
                variables,
              })
              .then((data) => {
                const { widgetsSaveBrowserInfo } = data?.data || {};

                setIsBrowserInfoSaved(true);
                setLastUnreadMessage(widgetsSaveBrowserInfo);
                setBrowserInfo(browserInfo);
              })
              .catch((error) => {
                console.error('Error saving browser info:', error);
              });
          },
        });
      };
      saveBrowserInfo();
    } catch (error) {
      console.error('useSaveBrowserInfo: Error in effect:', error);
    }
  }, [connection.data.visitorId, connection.data.customerId]);
};
