import React from 'react';
import { Background, ReactFlow } from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
const Detail = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        fitView
        // fitViewOptions={fitViewOptions}
        // onEdgeUpdate={onEdgeUpdate}
        // onNodesChange={onNodesChange}
        // onEdgesChange={onEdgesChange}
        // onConnect={onConnect}
        // onEdgeUpdateEnd={onEdgeUpdateEnd}
        // onEdgeUpdateStart={onEdgeUpdateStart}
        // nodeTypes={nodeTypes}
        // connectionMode={ConnectionMode.Loose}
        // onPaneClick={onPaneClick}
        // isValidConnection={isValidConnection}
        // onNodeDragStop={onNodeDragStop}
        // onEdgeDoubleClick={onDoubleClickEdge}
        // onSelectionChange={onNodesSelectionChange}
        // connectionLineComponent={ConnectionLine}
        minZoom={0.1}
        // edgeTypes={edgeTypes}
      >
        <Background />
      </ReactFlow>
    </div>
  );
};

export default Detail;
