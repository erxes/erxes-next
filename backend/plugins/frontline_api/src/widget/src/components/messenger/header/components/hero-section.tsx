import { HeaderItemsList } from './header-items-list';

export function HeroSection() {
  return (
    <div className="flex flex-col gap-4">
      <div className="gap-2 flex flex-col">
        <div className="font-semibold text-foreground text-base">
          Need help?
        </div>
        <div className="text-accent-foreground font-medium text-sm">
          Get help with setting up using erxes. We're available between 9.00 am
          and 6.00 pm (GMT +8). We'll get back to you as soon as possible.
        </div>
      </div>
      <HeaderItemsList />
    </div>
  );
}
