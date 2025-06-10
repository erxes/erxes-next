'use client';

import {
  cards as initialCards,
  stages as initialStages,
} from './constants/cards';

import { Stages } from './stage/components/Stages';
import { useState } from 'react';

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
  const [stageList, setStageList] = useState<StageType[]>(initialStages);
  const [cardList, setCardList] = useState<CardType[]>(initialCards);

  return (
    <div className="w-full h-full p-4 overflow-x-auto">
      <div className="flex gap-4 min-w-max">
        {stageList.map((stage) => (
          <Stages
            key={stage._id}
            stage={stage}
            cards={cardList
              .filter((c) => c.stageId === stage._id)
              // Sort cards in current order to show visually correct
              .sort((a, b) => {
                // Keep the order from cardList array (important!)
                return (
                  cardList.findIndex((c) => c._id === a._id) -
                  cardList.findIndex((c) => c._id === b._id)
                );
              })}
          />
        ))}
      </div>
    </div>
  );
};

export default DealsMain;
