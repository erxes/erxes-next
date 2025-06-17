import { CardList } from '@/deals/cards/components/CardList';
import { IStage } from '@/deals/types/stages';
import { StageHeader } from './StageHeader';

type Props = {
  stage: IStage;
};

export const Stage = ({ stage }: Props) => {
  return (
    <div className="w-72 h-full flex-none p-2 shadow-xs bg-babyBlue rounded-md">
      <StageHeader stage={stage} />

      <div className="overflow-auto max-h-full mt-3 mb-3 min-h-[100px]  space-y-2">
        <CardList stageId={stage._id} />
      </div>
    </div>
  );
};
