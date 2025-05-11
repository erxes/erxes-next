import React, { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Button, Card } from 'erxes-ui/components';
import { IconCopy, IconTrash } from '@tabler/icons-react';

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}: any) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const duplicateNode = useCallback(() => {
    const node = getNode(id);
    console.log({ node });
    // const position = {
    //   x: node.position.x + 50,
    //   y: node.position.y + 50,
    // };

    // addNodes({
    //   ...node,
    //   selected: false,
    //   dragging: false,
    //   id: `${node.id}-copy`,
    //   position,
    // });
  }, [id, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);

  console.log({ top, left, right, bottom, props });

  return (
    <Card
      style={{ top, left, right, bottom }}
      className="bg-background absolute z-10"
      {...props}
    >
      <Button variant="ghost" onClick={duplicateNode}>
        <IconCopy /> Duplicate
      </Button>
      <Button variant="ghost" onClick={deleteNode}>
        <IconTrash /> Delete
      </Button>
    </Card>
  );
}
