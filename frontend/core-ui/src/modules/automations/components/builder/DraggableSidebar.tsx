import React, { useRef, useState } from 'react';
import { AutomationBuilderSidebar } from './AutomationBuilderSidebar';

export const DraggableSidebar = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const onMouseMove = (e: MouseEvent) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const onMouseUp = () => setDragging(false);

  React.useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  });

  return (
    <div
      ref={sidebarRef}
      className="bg-white"
      onMouseDown={onMouseDown}
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        zIndex: 1000,
        cursor: 'move',
      }}
    >
      <AutomationBuilderSidebar />
    </div>
  );
};
