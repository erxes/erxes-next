'use client';

import { Button, Sidebar } from 'erxes-ui';
import { useState } from 'react';
import { ClientPortalDrawer } from './CreatePortal';

interface Portal {
  title: string;
  url: string;
}

export function ClientPortal() {
  const [portals, setPortals] = useState<Portal[]>([
    { title: 'Handbook', url: 'https://oldculture.io' },
    { title: 'Handbook', url: 'https://oldculture.io' },
    { title: 'Handbook', url: 'https://oldculture.io' },
    { title: 'Handbook', url: 'https://oldculture.io' },
    { title: 'Handbook', url: 'https://oldculture.io' },
    { title: 'Handbook', url: 'https://oldculture.io' },
  ]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  function handleCreatePortal(newPortal: Portal) {
    setPortals((prev) => [...prev, newPortal]);
    setSelectedIndex(portals.length); // select the newly added portal
    setIsDrawerOpen(false);
  }

  return (
    <div className="flex h-full w-full bg-red-500">
      <Sidebar collapsible="none" className="border-r flex-none">
        <Sidebar.Group>
          <Sidebar.GroupLabel>ClientPortal</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <div className="space-y-2">
              <Button className="w-full" onClick={() => setIsDrawerOpen(true)}>
                Add new Client Portal
              </Button>
              {portals.map((portal, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div
                    onClick={() => setSelectedIndex(index)}
                    className={`p-2 rounded-md cursor-pointer transition-colors ${
                      selectedIndex === index
                        ? 'bg-primary/20 text-primary'
                        : 'hover:bg-primary/10'
                    }`}
                  >
                    <p className="font-medium">{portal.title}</p>
                    <p className="text-gray-500 text-sm">{portal.url}</p>
                  </div>
                </div>
              ))}
            </div>
          </Sidebar.GroupContent>
        </Sidebar.Group>
      </Sidebar>
      <div className="w-full bg-blue-500 p-8">
        {portals[selectedIndex] && (
          <div className="space-y-2">
            <h2 className="text-xl font-bold">
              {portals[selectedIndex].title}
            </h2>
            <p className="text-gray-700">{portals[selectedIndex].url}</p>
          </div>
        )}
      </div>

      <ClientPortalDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onCreate={handleCreatePortal}
      />
    </div>
  );
}
