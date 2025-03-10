import { useCreateBlockNote } from '@blocknote/react';
import { BLOCK_SCHEMA } from '../constant';
import { Block } from '@blocknote/core';

export const useBlockEditor = (args?: { initialContent?: Block[] }) => {
  const editor = useCreateBlockNote({
    schema: BLOCK_SCHEMA,
    ...args,
  });

  return editor;
};
