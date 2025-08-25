import { useGetStatusByTeam } from '@/task/hooks/useGetStatusByTeam';
import { useTasks } from '@/task/hooks/useGetTasks';
import { ITask } from '@/task/types';
import type { DragEndEvent } from '@dnd-kit/core';
import { Board, BoardColumnProps, BoardItemProps } from 'erxes-ui';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { currentUserState } from 'ui-modules';
import { TaskBoardCard } from '@/task/components/TaskBoardCard';
import { useUpdateTask } from '@/task/hooks/useUpdateTask';
import clsx from 'clsx';

const fetchedTasksState = atom<BoardItemProps[]>([]);
export const allTasksMapState = atom<Record<string, ITask>>({});

export const TasksBoardNew = () => {
  const { teamId } = useParams();
  const allTasksMap = useAtomValue(allTasksMapState);
  const { updateTask } = useUpdateTask();

  const { statuses } = useGetStatusByTeam({
    variables: {
      teamId: teamId,
    },
    skip: !teamId,
  });

  const columns = statuses?.map((status) => ({
    id: status.value,
    name: status.label,
  }));

  const [tasks, setTasks] = useAtom(fetchedTasksState);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }
    const activeItem = allTasksMap[active.id as string];
    const overItem = allTasksMap[over.id as string];
    const overColumn =
      overItem?.status ||
      columns.find((col) => col.id === over.id)?.id ||
      columns[0]?.id;

    if (activeItem?.status === overColumn) {
      return;
    }
    updateTask({
      variables: {
        _id: activeItem?._id,
        status: overColumn,
      },
    });
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === activeItem?._id) {
          return {
            ...task,
            column: overColumn,
            sort: new Date().toISOString(),
          };
        }
        return task;
      }),
    );
  };

  return (
    <Board.Provider
      columns={columns}
      data={tasks}
      onDragEnd={handleDragEnd}
      boardId={clsx('tasks-board', teamId)}
    >
      {(column) => (
        <Board id={column.id} key={column.id}>
          <Board.Header>{column.name}</Board.Header>
          <TasksBoardCards column={column} />
        </Board>
      )}
    </Board.Provider>
  );
};

export const TasksBoardCards = ({ column }: { column: BoardColumnProps }) => {
  const currentUser = useAtomValue(currentUserState);
  const { projectId } = useParams();
  const [taskCards, setTaskCards] = useAtom(fetchedTasksState);
  const boardCards = taskCards
    .filter((task) => task.column === column.id)
    .sort((a, b) => {
      if (a.sort && b.sort) {
        return b.sort.toString().localeCompare(a.sort.toString());
      }
      return 0;
    });
  const { tasks } = useTasks({
    variables: {
      projectId: projectId || undefined,
      userId: currentUser?._id,
      status: column.id,
    },
  });
  const setAllTasksMap = useSetAtom(allTasksMapState);

  useEffect(() => {
    if (tasks) {
      setTaskCards((prev) => {
        const previousTasks = prev.filter(
          (task) => !tasks.some((t) => t._id === task.id),
        );
        return [
          ...previousTasks,
          ...tasks.map((task) => ({
            id: task._id,
            column: task.status,
            sort: task.updatedAt,
          })),
        ];
      });
      setAllTasksMap((prev) => {
        const newTasks = tasks.reduce((acc, task) => {
          acc[task._id] = task;
          return acc;
        }, {} as Record<string, ITask>);
        return { ...prev, ...newTasks };
      });
    }
  }, [tasks, setTaskCards, setAllTasksMap, column.id]);

  return (
    <Board.Cards id={column.id} items={boardCards.map((task) => task.id)}>
      {boardCards.map((task) => (
        <Board.Card
          key={task.id}
          id={task.id}
          name={task.name}
          column={column.id}
        >
          <TaskBoardCard id={task.id} column={column.id} />
        </Board.Card>
      ))}
    </Board.Cards>
  );
};
