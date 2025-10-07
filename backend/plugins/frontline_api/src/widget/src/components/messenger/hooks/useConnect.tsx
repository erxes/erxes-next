import { useState, useEffect } from 'react';
import { connect } from '@/components/messenger/graphql';
import { apolloClient } from '@/lib/apollo-client';
import { useSetAtom } from 'jotai';
import {
  connectionAtom,
  integrationIdAtom,
} from '@/components/messenger/atoms';
import { IConnection } from '@/types';
import { getLocalStorageItem } from '@/lib/utils';
import { useSaveBrowserInfo } from '@/components/messenger/hooks/useSaveBrowserInfo';
import { getErxesSettings } from '../../../../config';

interface connectionProps {
  isCloudFlareEnabled?: boolean;
  isTicketEnabled?: boolean;
  brandId: string;
}

export const useConnect = ({
  isCloudFlareEnabled = false,
  isTicketEnabled = false,
  brandId,
}: connectionProps) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const setConnection = useSetAtom(connectionAtom);
  const setIntegrationId = useSetAtom(integrationIdAtom);
  const cachedCustomerId = getLocalStorageItem('customerId');

  // Call useSaveBrowserInfo hook
  useSaveBrowserInfo();

  useEffect(() => {
    const executeConnection = async () => {
      try {
        setLoading(true);
        setError(null);

        let visitorId;

        // if (!cachedCustomerId) {
        const { getVisitorId } = await import('@/lib/utils');

        visitorId = await getVisitorId();
        // }

        const erxesSettings = getErxesSettings();
        const messengerSettings = erxesSettings?.messenger;
        const { email, phone, code, data, companyData } =
          messengerSettings || {};

        const variables = email
          ? {
              brandCode: brandId,
              visitorId: null,
              cachedCustomerId: cachedCustomerId || undefined,
              email,
              isUser: true,
              phone,
              code,
              data,
              companyData,
            }
          : {
              brandCode: brandId,
              visitorId,
              cachedCustomerId: cachedCustomerId || undefined,
              isUser: false,
            };

        const response = await apolloClient.mutate({
          mutation: connect(isCloudFlareEnabled, isTicketEnabled),
          variables,
        });

        setResult(response as any);

        const connectionData = response?.data?.widgetsMessengerConnect;
        if (connectionData) {
          setConnection((prev: IConnection) => ({
            ...prev,
            data: {
              ...prev.data,
              visitorId: connectionData.visitorId,
              customerId: connectionData.customerId,
              messengerData: connectionData.messengerData,
            },
          }));
          setIntegrationId(connectionData.integrationId);
        }
      } catch (err) {
        console.warn('useConnect error:', err);
        setError(err as any);
      } finally {
        setLoading(false);
      }
    };

    executeConnection();
  }, [isCloudFlareEnabled, isTicketEnabled, brandId]);

  return {
    result,
    loading,
    error,
  };
};
