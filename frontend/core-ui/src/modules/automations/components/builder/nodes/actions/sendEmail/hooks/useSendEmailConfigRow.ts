import { useState } from 'react';

export const useSendEmailConfigRow = () => {
  const [isOpen, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(!isOpen);
  };

  return {
    isOpen,
    toggleOpen,
  };
};
