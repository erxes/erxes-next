import { CardList } from '@/deals/cards/components/CardList';
import { IStage } from '@/deals/types/stages';
import { StageHeader } from './StageHeader';

type Props = {
  stage: IStage;
};

export const Stage = ({ stage }: Props) => {
  return (
    <>
      <StageHeader stage={stage} />
      <div className="overflow-auto flex-auto flex flex-col gap-2 px-2 pb-3">
        <CardList stageId={stage._id} />
      </div>
    </>
  );
};
