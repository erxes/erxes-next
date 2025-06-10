import { IStage } from '@/deals/types/stages';
// import { Card } from '@/deals/cards/Card';
import { StageHeader } from './StageHeader';

type Props = {
  stage: IStage;
};

export const Stage = ({ stage }: Props) => {
  return (
    <div className="w-[280px] h-full flex-none p-2 shadow-sm bg-babyBlue rounded-sm">
      <StageHeader stage={stage} />
      {/* <div className="overflow-auto max-h-full mt-3 mb-3 min-h-[100px]  space-y-2">
        {cards.map((card) => (
          <Card key={card._id} card={card} />
        ))}
      </div> */}
    </div>
  );
};
