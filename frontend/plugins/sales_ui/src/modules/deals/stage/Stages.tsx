import { StageHeader } from './StageHeader';
import { cards } from '../../constants';

type Props = {
  stage: any;
};

export const Stages = ({ stage }: Props) => {
  const renderCard = (card: any) => {
    return (
      <div className="bg-white mb-2 p-2 shadow-sm text-sm">{card.title}</div>
    );
  };

  return (
    <div
      className="w-[280px] p-2 shadow-sm bg-babyBlue rounded-sm"
      key={stage._id}
    >
      <StageHeader stage={stage} />
      <div className="overflow-auto max-h-full mt-3 mb-3">
        {cards.map((card) => renderCard(card))}
      </div>
      <div className="flex gap-3 text-gray-300">+ {'Add a deal'}</div>
    </div>
  );
};
