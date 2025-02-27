import { BlockNoteSchema, defaultInlineContentSpecs } from '@blocknote/core';
import { Mention } from '../components/BlockEditor';

export const BLOCK_SCHEMA = BlockNoteSchema.create({
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    mention: Mention,
  },
});
