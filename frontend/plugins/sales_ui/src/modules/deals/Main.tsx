'use client';

import { StagesList } from '@/deals/stage/components/StagesList';

export type StageType = {
  _id: string;
  title: string;
};

export type CardType = {
  _id: string;
  title: string;
  stageId: string;
};

const DealsMain = () => {
  return (
    <div className="w-full h-full p-4 overflow-x-auto">
      <div className="flex gap-4 min-w-max h-full">
        <StagesList />
      </div>
    </div>
  );
};

export default DealsMain;
