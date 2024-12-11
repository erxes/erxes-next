import { REACT_APP_API_URL } from 'erxes-ui/utils/config';
import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  currentOrganizationState,
  isCurrentOrganizationLoadedState,
} from 'erxes-shared-states';

export const OrganizationProviderEffect = () => {
  const [isCurrentOrganizationLoaded, setIsCurrentOrganizationLoaded] =
    useRecoilState(isCurrentOrganizationLoadedState);

  const setCurrentOrganization = useSetRecoilState(currentOrganizationState);

  useEffect(() => {
    if (isCurrentOrganizationLoaded) {
      return;
    }

    fetch(REACT_APP_API_URL + '/initial-setup')
      .then((res) => res.json())
      .then((data) => {
        if (data === 'no owner') {
          setIsCurrentOrganizationLoaded(true);
          setCurrentOrganization({
            haveOwner: false,
            _id: 'os',
            name: 'OS',
            subdomain: 'os',
          });
          return;
        }

        const organization = {
          theme: {
            data,
          },
          subdomain: 'os',
          haveOwner: true,
          name: 'OS',
          _id: 'os',
        };

        setCurrentOrganization(organization);
        setIsCurrentOrganizationLoaded(true);
      })
      .catch(() => {
        setCurrentOrganization(null);
        setIsCurrentOrganizationLoaded(false);
      });
  }, [
    isCurrentOrganizationLoaded,
    setIsCurrentOrganizationLoaded,
    setCurrentOrganization,
  ]);

  return null;
};
