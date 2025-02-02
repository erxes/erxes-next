import { useState } from 'react';

import { IconPlus } from '@tabler/icons-react';
import { Button, cn } from 'erxes-ui';

import { SelectCategory } from '@/products/product-category/components/SelectCategory';
import { SelectTags } from '@/tags/components/SelectTags';

export const ProductsDetailPage = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<string>('');
  return (
    <div className="flex flex-col gap-12 overflow-auto">
      <div className="p-8 flex items-center gap-4">
        <SelectTags
          selected={tags}
          onSelect={(tags) => setTags(tags as string[])}
          tagType="core:customer"
        />
        <SelectCategory
          selected={category}
          onSelect={(categoryId) => setCategory(categoryId)}
        />
      </div>
      <div className="p-12 grid grid-cols-5 gap-12 grid-flow-row max-w-screen-xl mx-auto">
        <div className="flex flex-col gap-4 items-start">
          <h2 className="uppercase text-muted-foreground text-sm font-bold font-mono">
            Button default
          </h2>
          <Button size="lg">Continue</Button>

          <Button>Continue</Button>

          <Button size="sm">Continue</Button>

          <Button size="icon">
            <IconPlus />
          </Button>
        </div>
        <div className="flex flex-col gap-4 items-start">
          <h2 className="uppercase text-muted-foreground text-sm font-bold font-sem font-mono">
            Button outline
          </h2>
          <Button size="lg" variant="outline">
            Continue
          </Button>

          <Button variant="outline">Continue</Button>

          <Button size="sm" variant="outline">
            Continue
          </Button>
          <Button size="icon" variant="outline">
            <IconPlus />
          </Button>
        </div>
        <div className="flex flex-col gap-4 items-start">
          <h2 className="uppercase text-muted-foreground text-sm font-bold font-sem font-mono">
            Button link
          </h2>
          <Button size="lg" variant="link">
            Continue
          </Button>

          <Button variant="link">Continue</Button>

          <Button size="sm" variant="link">
            Continue
          </Button>
          <Button size="icon" variant="link">
            <IconPlus />
          </Button>
        </div>
        <div className="flex flex-col gap-4 items-start">
          <h2 className="uppercase text-muted-foreground text-sm font-bold font-sem font-mono">
            Button ghost
          </h2>
          <Button size="lg" variant="ghost">
            Continue
          </Button>

          <Button variant="ghost">Continue</Button>

          <Button size="sm" variant="ghost">
            Continue
          </Button>
          <Button size="icon" variant="ghost">
            <IconPlus />
          </Button>
        </div>
        <div className="flex flex-col gap-4 items-start">
          <h2 className="uppercase text-muted-foreground text-sm font-bold font-sem font-mono">
            Button secondary
          </h2>
          <Button size="lg" variant="secondary">
            Continue
          </Button>

          <Button variant="secondary">Continue</Button>

          <Button size="sm" variant="secondary">
            Continue
          </Button>
          <Button size="icon" variant="secondary">
            <IconPlus />
          </Button>
        </div>
      </div>

      <div className="p-12 grid grid-cols-9 gap-4 mx-auto">
        {[
          'bg-border',
          'bg-input',
          'bg-ring',
          'bg-background',
          'bg-foreground',
          'bg-primary',
          'bg-primary-foreground',
          'bg-system',
          'bg-system-foreground',
          'bg-secondary',
          'bg-secondary-foreground',
          'bg-destructive',
          'bg-destructive-foreground',
          'bg-muted',
          'bg-muted-foreground',
          'bg-accent',
          'bg-accent-foreground',
          'bg-popover',
          'bg-popover-foreground',
          'bg-card',
          'bg-card-foreground',
          'bg-sidebar',
          'bg-sidebar-foreground',
          'bg-sidebar-primary',
          'bg-sidebar-primary-foreground',
          'bg-sidebar-accent',
          'bg-sidebar-accent-foreground',
          'bg-sidebar-border',
          'bg-sidebar-ring',
          'bg-radix-default',
          'bg-radix-foreground',
          'bg-radix-tomato',
          'bg-radix-tomato-foreground',
          'bg-radix-red',
          'bg-radix-red-foreground',
          'bg-radix-ruby',
          'bg-radix-ruby-foreground',
          'bg-radix-crimson',
          'bg-radix-crimson-foreground',
          'bg-radix-orange',
          'bg-radix-orange-foreground',
          'bg-radix-yellow',
          'bg-radix-yellow-foreground',
          'bg-radix-green',
          'bg-radix-green-foreground',
          'bg-radix-teal',
          'bg-radix-teal-foreground',
          'bg-radix-sky',
          'bg-radix-sky-foreground',
          'bg-radix-blue',
          'bg-radix-blue-foreground',
          'bg-radix-purple',
          'bg-radix-purple-foreground',
          'bg-radix-violet',
          'bg-radix-violet-foreground',
          'bg-radix-pink',
          'bg-radix-pink-foreground',
          'bg-radix-plum',
          'bg-radix-plum-foreground',
          'bg-radix-gold',
          'bg-radix-gold-foreground',
          'bg-radix-mint',
          'bg-radix-mint-foreground',
        ].map((item) => (
          <div className="flex flex-col gap-1">
            <div className="text-xs text-muted-foreground whitespace-nowrap">
              {item.replace('bg-', '').replace('-', ' ')}
            </div>
            <div
              className={cn('bg-zinc-200 rounded-md h-20 w-20 border', item)}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};
