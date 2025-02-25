import { Block } from '@blocknote/core';

export const parseBlocks = (content: string) => {
  try {
    const blocks = JSON.parse(content) as Block[];
    return blocks;
  } catch (error) {
    return false;
  }
};
