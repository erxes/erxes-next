'use client';

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

export const Collapsible = Object.assign(CollapsiblePrimitive.Root, {
  Trigger: CollapsiblePrimitive.CollapsibleTrigger,
  Content: CollapsiblePrimitive.CollapsibleContent,
});
