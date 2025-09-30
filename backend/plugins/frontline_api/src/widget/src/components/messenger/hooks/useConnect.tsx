import { useState, useEffect } from 'react';
import { connect } from '@/components/messenger/graphql';
import { apolloClient } from '@/lib/apollo-client';

interface connectionProps {
  isCloudFlareEnabled?: boolean;
  isTicketEnabled?: boolean;
  brandId: string;
  email?: string;
  phone?: string;
  code?: string;
  isUser?: boolean;
  data?: any;
  companyData?: any;
}

export const useConnect = ({
  isCloudFlareEnabled = false,
  isTicketEnabled = false,
  brandId,
  email,
  phone,
  code,
  isUser = false,
  data,
  companyData,
}: connectionProps) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const executeConnection = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apolloClient.mutate({
          mutation: connect(isCloudFlareEnabled, isTicketEnabled),
          variables: {
            brandCode: brandId,
            email: email,
            phone: phone,
            code: code,
            isUser: isUser,
            data: data,
            companyData: companyData,
          },
        });

        setResult(response as any);
      } catch (err) {
        console.warn('useConnect error:', err);
        setError(err as any);
      } finally {
        setLoading(false);
      }
    };

    executeConnection();
  }, [
    isCloudFlareEnabled,
    isTicketEnabled,
    brandId,
    email,
    phone,
    code,
    isUser,
    data,
    companyData,
  ]);

  return {
    result,
    loading,
    error,
  };
};
