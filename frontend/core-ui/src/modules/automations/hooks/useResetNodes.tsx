import { NodeData } from '@/automations/types';
import {
  generateEdges,
  generateNodes,
} from '@/automations/utils/automationBuilderUtils';
import { Edge, Node } from '@xyflow/react';
import { SetStateAction } from 'jotai';
import { Dispatch } from 'react';
import { IAction, ITrigger } from 'ui-modules';

export const useResetNodes = ({
  nodes,
  triggers,
  actions,
  setEdges,
  setNodes,
}: {
  nodes: Node<NodeData>[];
  triggers: ITrigger[];
  actions: IAction[];
  setNodes: Dispatch<SetStateAction<Node<NodeData>[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
}) => {
  const resetNodes = () => {
    const updatedNodes: any[] = generateNodes(
      { triggers, actions, workFlowActions: [] },
      {},
    );

    const mergedArray = updatedNodes.map((node1) => {
      let node2 = nodes.find((o) => o.id === node1.id);

      if (node2) {
        return {
          ...node1,
          data: { ...node2.data, ...node1.data },
          position: { ...node1.position, ...node2.position },
        };
      }
      return node1;
    });
    setNodes(mergedArray);
    const generatedEdges = generateEdges({
      triggers,
      actions,
      workFlowActions: [],
    });
    setEdges(generatedEdges);
  };

  return { resetNodes };
};
