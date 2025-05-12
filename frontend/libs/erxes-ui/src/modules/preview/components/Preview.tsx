import { ImperativePanelHandle } from 'react-resizable-panels';
import { PreviewContext, usePreviewContext } from '../context/PreviewContext';
import React from 'react';
import { Button, Resizable, Separator, ToggleGroup } from 'erxes-ui/components';
import {
  IconDeviceImacFilled,
  IconDeviceMobileFilled,
  IconDeviceIpadFilled,
  IconWindowMaximize,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const PreviewProvider = ({ children }: { children: React.ReactNode }) => {
  const resizablePanelRef = React.useRef<ImperativePanelHandle>(null);

  return (
    <PreviewContext.Provider value={{ resizablePanelRef }}>
      <div className="flex flex-col">{children}</div>
    </PreviewContext.Provider>
  );
};

export const PreviewToolbar = ({ path }: { path?: string }) => {
  const { resizablePanelRef } = usePreviewContext();
  return (
    <ToggleGroup
      type="single"
      defaultValue="100"
      className="text-muted-foreground py-2"
      onValueChange={(value) => {
        if (resizablePanelRef?.current) {
          resizablePanelRef.current.resize(parseInt(value));
        }
      }}
    >
      <ToggleGroup.Item value="100" className="" title="Desktop">
        <IconDeviceImacFilled className="h-3.5 w-3.5" />
        <span>Desktop</span>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="60" title="Tablet">
        <IconDeviceIpadFilled className="h-3.5 w-3.5" />
        <span>Tablet</span>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="30" title="Mobile">
        <IconDeviceMobileFilled className="h-3.5 w-3.5" />
        <span>Mobile</span>
      </ToggleGroup.Item>
      <Separator.Inline />
      {path && (
        <Button variant="ghost" asChild title="Open in New Tab">
          <Link to={path} target="_blank">
            <span>Open in New Tab</span>
            <IconWindowMaximize className="h-3.5 w-3.5" />
          </Link>
        </Button>
      )}
    </ToggleGroup>
  );
};

export const View = React.forwardRef<
  React.ElementRef<typeof Resizable.PanelGroup>,
  {
    height: number;
    iframeSrc: string;
  } & Omit<React.ComponentProps<typeof Resizable.PanelGroup>, 'direction'>
>(({ height, iframeSrc, ...props }, ref) => {
  const { resizablePanelRef } = usePreviewContext();
  return (
    <Resizable.PanelGroup
      className="relative z-10"
      direction="horizontal"
      {...props}
      ref={ref}
    >
      <Resizable.Panel
        ref={resizablePanelRef}
        className="relative aspect-[4/2.5] rounded-xl border bg-background md:aspect-auto"
        defaultSize={100}
        minSize={30}
      >
        <iframe
          src={iframeSrc}
          width="100%"
          height={height}
          title="Button Primary Story"
        />
      </Resizable.Panel>
      <Resizable.Handle className="relative hidden w-3 bg-transparent p-0 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-[6px] after:-translate-y-1/2 after:translate-x-[-1px] after:rounded-full after:bg-border after:transition-all after:hover:h-10 md:block" />
      <Resizable.Panel defaultSize={0} minSize={0} />
    </Resizable.PanelGroup>
  );
});

export const Preview = Object.assign(PreviewProvider, {
  Toolbar: PreviewToolbar,
  View: View,
});
