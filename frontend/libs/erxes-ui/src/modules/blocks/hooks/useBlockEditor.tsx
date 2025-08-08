import { Block } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import { BLOCK_SCHEMA, TABLE_SCHEMA } from '../constant';

export const useBlockEditor = (args?: { initialContent?: Block[] }) => {
  const editor = useCreateBlockNote({
    schema: BLOCK_SCHEMA,
    tables: TABLE_SCHEMA,
    ...args,
  });

  return editor;
};
