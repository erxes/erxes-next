'use client';

import * as React from 'react';
import {
  Calculator,
  Calendar,
  CommandIcon,
  CreditCard,
  Settings,
  Smile,
  User,
} from 'lucide-react';

import { Command, Sidebar } from 'erxes-ui';

export function QuickActions() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <Sidebar.MenuButton onClick={() => setOpen(true)}>
        <CommandIcon />
        <span>Quick Actions</span>
        <Command.Shortcut>⌘K</Command.Shortcut>
      </Sidebar.MenuButton>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        dialogContentClassName="max-w-xl"
      >
        <Command.Input placeholder="Type a command or search..." />
        <Command.List className="styled-scroll">
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group heading="Suggestions">
            <Command.Item>
              <Calendar />
              <span>Calendar</span>
            </Command.Item>
            <Command.Item>
              <Smile />
              <span>Search Emoji</span>
            </Command.Item>
            <Command.Item>
              <Calculator />
              <span>Calculator</span>
            </Command.Item>
          </Command.Group>
          <Command.Separator />
          <Command.Group heading="Settings">
            <Command.Item>
              <User />
              <span>Profile</span>
              <Command.Shortcut>⌘P</Command.Shortcut>
            </Command.Item>
            <Command.Item>
              <CreditCard />
              <span>Billing</span>
              <Command.Shortcut>⌘B</Command.Shortcut>
            </Command.Item>
            <Command.Item>
              <Settings />
              <span>Settings</span>
              <Command.Shortcut>⌘S</Command.Shortcut>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </>
  );
}
