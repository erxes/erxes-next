import { PropsWithChildren } from 'react';
import { CmsHeader } from './CmsHeader';

export const CmsLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="">
      <CmsHeader />
      {children}
    </div>
  );
};
