import { CreateOwner } from '@/organization/owner/components/CreateOwner';
import { currentOrganizationState } from 'erxes-shared-states';

import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';

import { isDefined } from 'erxes-ui/utils';
import { AppPath } from '@/types/AppPath';

const CreateOwnerPage = () => {
  const navigate = useNavigate();
  const currentOrganization = useRecoilValue(currentOrganizationState);

  useEffect(() => {
    if (isDefined(currentOrganization) && currentOrganization.hasOwner) {
      navigate(AppPath.Index);
    }
  }, [currentOrganization, navigate]);

  return (
    <div className="flex items-center justify-center my-40">
      <div className="motion-preset-slide-down-md grid gap-5">
        <div className="flex flex-col items-center gap-2">
          <h2 className="font-semibold text-2xl">
            Initial Configuration Steps
          </h2>
          <p className="text-xs text-muted-foreground">
            Please fill out the following form to complete your installation
          </p>
        </div>
        <CreateOwner />
      </div>
    </div>
  );
};

export default CreateOwnerPage;
