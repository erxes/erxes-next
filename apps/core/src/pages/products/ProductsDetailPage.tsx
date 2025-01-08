import { IconPlus } from '@tabler/icons-react';
import { Button } from 'erxes-ui';

export const ProductsDetailPage = () => {
  return (
    <>
      <div className="p-12 grid grid-cols-3 gap-12 grid-flow-row max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-4 items-start">
          <h2 className="text-xl font-bold">Button default</h2>
          <Button size="lg">Continue</Button>

          <Button>Continue</Button>

          <Button size="sm">Continue</Button>

          <Button size="icon">
            <IconPlus />
          </Button>
        </div>
        <div className="flex flex-col gap-4 items-start">
          <h2 className="text-xl font-bold">Button outline</h2>
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
          <h2 className="text-xl font-bold">Button link</h2>
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
          <h2 className="text-xl font-bold">Button ghost</h2>
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
      </div>
    </>
  );
};
