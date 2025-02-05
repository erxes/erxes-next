import { BlockNoteSchema, defaultInlineContentSpecs } from '@blocknote/core';
import { Mention } from 'erxes-ui/modules/blocks/components/BlockEditor';

export const BLOCK_SCHEMA = BlockNoteSchema.create({
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    mention: Mention,
  },
});
