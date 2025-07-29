import {
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import type {
  DndContextProps,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { IStage } from '@/deals/types/stages';
import { IUser } from 'ui-modules';

export type KanbanItemProps = {
  id: string;
  name: string;
  column: string;
  startDate: Date;
  closeDate: Date;
  createdAt: Date;
  assignedUsers: IUser[];
} & Record<string, unknown>;

// export type KanbanColumnProps = {
//   id: string;
//   name: string;
// } & Record<string, unknown>;

export type KanbanContextProps<
  T extends KanbanItemProps = KanbanItemProps,
  C extends IStage = IStage,
> = {
  columns: C[];
  data: T[];
  activeCardId: string | null;
};

export type KanbanBoardProps = {
  id: string;
  children: ReactNode;
  className?: string;
  onColumnsChange?: (newColumns: any[]) => void;
};

export type KanbanCardProps<T extends KanbanItemProps = KanbanItemProps> = T & {
  children?: ReactNode;
  className?: string;
};

export type KanbanCardsProps<T extends KanbanItemProps = KanbanItemProps> =
  Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'id'> & {
    children: (item: T) => ReactNode;
    id: string;
  };

  export type KanbanHeaderProps = HTMLAttributes<HTMLDivElement>;

  export type KanbanProviderProps<
    T extends KanbanItemProps = KanbanItemProps,
    C extends IStage = IStage,
  > = Omit<DndContextProps, 'children'> & {
    children: (column: C) => ReactNode;
    className?: string;
    columns: C[];
    data: T[];
    onDataChange?: (data: T[]) => void;
    onColumnsChange?: (newColumns: any[]) => void;
    onDragStart?: (event: DragStartEvent) => void;
    onDragEnd?: (event: DragEndEvent) => void;
    onDragOver?: (event: DragOverEvent) => void;
  };
