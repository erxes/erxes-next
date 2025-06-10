'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  cards as initialCards,
  stages as initialStages,
} from '~/modules/deals/constants/cards';

import { Stages } from '@/deals/stage/components/Stages';
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

const Draggable = () => {
  const [stageList, setStageList] = useState<StageType[]>(initialStages);
  const [cardList, setCardList] = useState<CardType[]>(initialCards);

  const sensors = useSensors(useSensor(PointerSensor));

  // Handle dragging over to change stageId of a card if dragged between stages
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!active || !over) return;

    const activeCard = cardList.find((card) => card._id === active.id);
    if (!activeCard) return;

    const overCard = cardList.find((card) => card._id === over.id);
    const overStage = stageList.find(
      (stage) => `stage-${stage._id}` === over.id,
    );

    const newStageId = overCard?.stageId || overStage?._id;

    if (newStageId && newStageId !== activeCard.stageId) {
      setCardList((prev) =>
        prev.map((card) =>
          card._id === active.id ? { ...card, stageId: newStageId } : card,
        ),
      );
    }
  };

  // Handle drag end for stages and cards reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;

    const activeStage = stageList.find((s) => `stage-${s._id}` === active.id);
    const overStage = stageList.find((s) => `stage-${s._id}` === over.id);

    // 1) If dragging a stage (column), reorder stages
    if (activeStage && overStage) {
      const oldIndex = stageList.findIndex((s) => s._id === activeStage._id);
      const newIndex = stageList.findIndex((s) => s._id === overStage._id);
      if (oldIndex !== newIndex) {
        setStageList((prev) => arrayMove(prev, oldIndex, newIndex));
      }
      return;
    }

    // 2) Dragging cards - reorder within the same stage or between stages
    const activeCard = cardList.find((c) => c._id === active.id);
    if (!activeCard) return;

    const overCard = cardList.find((c) => c._id === over.id);

    if (overCard && activeCard.stageId === overCard.stageId) {
      // Same stage reorder
      const stageCards = cardList.filter(
        (c) => c.stageId === activeCard.stageId,
      );
      const oldIndex = stageCards.findIndex((c) => c._id === activeCard._id);
      const newIndex = stageCards.findIndex((c) => c._id === overCard._id);

      if (oldIndex !== newIndex) {
        const newStageCards = arrayMove(stageCards, oldIndex, newIndex);
        // Now merge back into cardList with updated order for that stage only
        setCardList((prev) => {
          const others = prev.filter((c) => c.stageId !== activeCard.stageId);
          return [...others, ...newStageCards];
        });
      }
    } else if (overCard && activeCard.stageId !== overCard.stageId) {
      // Card moved between stages - put at end of new stage (or better: at position of over card)
      const newStageId = overCard.stageId;

      // Remove active card from old stage and insert into new stage cards
      const oldStageCards = cardList.filter(
        (c) => c.stageId === activeCard.stageId && c._id !== activeCard._id,
      );
      const newStageCards = cardList.filter((c) => c.stageId === newStageId);

      // Find index of overCard in newStageCards to insert activeCard there
      const insertIndex = newStageCards.findIndex(
        (c) => c._id === overCard._id,
      );

      // Create new array for new stage with active card inserted
      const updatedNewStageCards = [
        ...newStageCards.slice(0, insertIndex),
        { ...activeCard, stageId: newStageId },
        ...newStageCards.slice(insertIndex),
      ];

      setCardList([...oldStageCards, ...updatedNewStageCards]);
    } else if (!overCard) {
      // Dropped on empty stage area (droppable div) - move card to that stage and put at end
      const overId = over.id;
      let overStageId: string | null = null;

      if (typeof overId === 'string' && overId.startsWith('stage-')) {
        overStageId = overId.replace('stage-', '');
      }

      if (overStageId) {
        setCardList((prev) => {
          // Remove card from old stage
          const filtered = prev.filter((c) => c._id !== activeCard._id);
          // Add card at end with new stageId
          return [...filtered, { ...activeCard, stageId: overStageId! }];
        });
      }
    }
  };

  return (
    <div className="w-full h-full p-4 overflow-x-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <SortableContext
          items={stageList.map((s) => `stage-${s._id}`)}
          strategy={horizontalListSortingStrategy}
        >
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
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Draggable;
