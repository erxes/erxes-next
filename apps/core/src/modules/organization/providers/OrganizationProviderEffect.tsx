import { REACT_APP_API_URL } from 'erxes-ui/utils/config';
import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  CurrentOrganization,
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

    fetch(REACT_APP_API_URL + '/v3/initial-setup')
      .then((res) => res.json())
      .then((data: CurrentOrganization) => {
        if (data.hasOwner == false) {
          setIsCurrentOrganizationLoaded(true);
          setCurrentOrganization(data);
          return;
        }

        setCurrentOrganization(data);
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
