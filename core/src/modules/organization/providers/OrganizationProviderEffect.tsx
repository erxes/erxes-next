import { useEffect } from 'react';

import {
  clientConfigApiStatusState,
  CurrentOrganization,
  currentOrganizationState,
  isCurrentOrganizationLoadedState,
} from 'erxes-shared-states';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { REACT_APP_API_URL } from 'erxes-ui/utils/config';

export const OrganizationProviderEffect = () => {
  const [isCurrentOrganizationLoaded, setIsCurrentOrganizationLoaded] =
    useRecoilState(isCurrentOrganizationLoadedState);

  const setCurrentOrganization = useSetRecoilState(currentOrganizationState);
  const setApiStatus = useSetRecoilState(clientConfigApiStatusState);

  useEffect(() => {
    if (isCurrentOrganizationLoaded) {
      return;
    }

    fetch(REACT_APP_API_URL + '/v32/initial-setup')
      .then((res) => res.json())
      .then((data: CurrentOrganization) => {
        if (data.hasOwner == false) {
          setIsCurrentOrganizationLoaded(true);
          setCurrentOrganization(data);
          return;
        }

        setCurrentOrganization(data);
        setIsCurrentOrganizationLoaded(true);
        setApiStatus({
          isErrored: false,
          isLoaded: true,
        })
      })
      .catch((e: Error) => {
        setCurrentOrganization(null);
        setIsCurrentOrganizationLoaded(false);
        setApiStatus({
          isErrored: true,
          isLoaded: true,
          error: e
        })
      });
  }, [
    isCurrentOrganizationLoaded,
    setIsCurrentOrganizationLoaded,
    setCurrentOrganization,
  ]);

  return null;
};
