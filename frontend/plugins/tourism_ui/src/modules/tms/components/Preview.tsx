import { useState, useRef, useEffect } from 'react';
import { Button, Input, Resizable, ToggleGroup } from 'erxes-ui';
import {
  IconDeviceImacFilled,
  IconDeviceMobileFilled,
  IconDeviceIpadFilled,
} from '@tabler/icons-react';
import { TmsFormType } from '@/tms/constants/formSchema';
import { ImperativePanelHandle } from 'react-resizable-panels';

interface PreviewProps {
  formData?: Partial<TmsFormType>;
}

export default function TmsPreview({ formData }: PreviewProps) {
  const [deviceSize, setDeviceSize] = useState<number>(100);
  const resizablePanelRef = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    const checkPanelSize = () => {
      if (resizablePanelRef?.current) {
        const panelSize = resizablePanelRef.current.getSize();
        setDeviceSize(panelSize);
      }
    };

    const interval = setInterval(checkPanelSize, 100);
    return () => clearInterval(interval);
  }, []);

  const tourName = formData?.name || 'Таны тур оператор';
  const themeColor = formData?.color || '#4F46E5';
  const logoUrl = formData?.logo || 'https://placehold.co/150x150';

  const renderLoginForm = () => {
    const isMobile = deviceSize <= 30;
    const isTablet = deviceSize > 30 && deviceSize <= 60;

    return (
      <div
        className={`bg-background mx-auto rounded-md shadow-lg ${
          isMobile
            ? 'p-4 max-w-[280px]'
            : isTablet
            ? 'p-5 max-w-[400px]'
            : 'p-6 max-w-[80vh]'
        }`}
      >
        <div
          className={`flex justify-center items-center ${
            isMobile ? 'mb-4' : 'mb-6'
          }`}
        >
          <img
            src={logoUrl}
            alt="Company Logo"
            width={isMobile ? 80 : 100}
            height={isMobile ? 24 : 30}
          />
        </div>

        <div className={isMobile ? 'mb-3' : 'mb-4'}>
          <h2
            className={`font-semibold text-foreground ${
              isMobile ? 'mb-1 text-lg' : 'mb-1 text-xl'
            }`}
          >
            Sign in to your account
          </h2>
          <p
            className={`text-muted-foreground ${
              isMobile ? 'text-xs' : 'text-sm'
            }`}
          >
            Enter your email and password below to access your account.
          </p>
        </div>

        <div className={isMobile ? 'mb-3' : 'mb-4'}>
          <Input
            type="text"
            value={tourName}
            disabled
            className={`w-full rounded border bg-background text-foreground ${
              isMobile ? 'p-2 text-sm' : 'p-2'
            }`}
          />
        </div>

        <div className={isMobile ? 'mb-3' : 'mb-4'}>
          <label className={`block mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Email
          </label>
          <Input
            type="email"
            value="info@erxes.io"
            disabled
            className={`w-full rounded border bg-background text-foreground ${
              isMobile ? 'p-2 text-sm' : 'p-2'
            }`}
          />
        </div>

        <div className={isMobile ? 'mb-3' : 'mb-4'}>
          <div className="flex justify-between items-center mb-1">
            <label
              className={`block text-foreground ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}
            >
              Password
            </label>
            <span
              className={`text-muted-foreground ${
                isMobile ? 'text-[10px]' : 'text-xs'
              }`}
            >
              Forgot password?
            </span>
          </div>
          <Input
            type="password"
            value="••••••••"
            disabled
            className={`w-full rounded border bg-background text-foreground ${
              isMobile ? 'p-2 text-sm' : 'p-2'
            }`}
          />
        </div>

        <Button
          disabled
          className={`w-full text-foreground ${
            isMobile ? 'px-3 py-2 mt-2 text-sm' : 'px-4 py-2 mt-2'
          }`}
          style={{ backgroundColor: themeColor, borderColor: themeColor }}
        >
          Sign in
        </Button>
      </div>
    );
  };

  const getMaxWidth = () => {
    if (deviceSize <= 30) return '100%';
    if (deviceSize <= 60) return '580px';
    return '100%';
  };

  const getCurrentDeviceValue = () => {
    if (deviceSize <= 30) return '30';
    if (deviceSize <= 60) return '60';
    return '100';
  };

  const PreviewToolbar = () => {
    return (
      <ToggleGroup
        type="single"
        value={getCurrentDeviceValue()}
        className="py-2 text-muted-foreground"
        onValueChange={(value) => {
          const size = parseInt(value);
          setDeviceSize(size);
          if (resizablePanelRef?.current) {
            resizablePanelRef.current.resize(size);
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
      </ToggleGroup>
    );
  };

  const renderPreviewContent = () => {
    const isMobile = deviceSize <= 30;

    return (
      <div className="h-full bg-background">
        <div
          className="mx-auto h-full transition-all duration-300"
          style={{ maxWidth: getMaxWidth() }}
        >
          <div
            className={`flex justify-center items-center w-full h-full rounded-md bg-background ${
              isMobile ? 'p-2' : 'p-4'
            }`}
          >
            {renderLoginForm()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center items-center h-12 border-b bg-background">
        <PreviewToolbar />
      </div>
      <div className="overflow-hidden flex-1">
        <Resizable.PanelGroup className="relative z-10" direction="horizontal">
          <Resizable.Panel
            ref={resizablePanelRef}
            className="relative aspect-[4/2.5] rounded-xl border bg-background md:aspect-auto"
            defaultSize={100}
            minSize={30}
          >
            {renderPreviewContent()}
          </Resizable.Panel>
          <Resizable.Handle className="relative hidden w-3 bg-transparent p-0 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-[6px] after:-translate-y-1/2 after:translate-x-[-1px] after:rounded-full after:bg-border after:transition-all after:hover:h-10 md:block" />
          <Resizable.Panel defaultSize={0} minSize={0} />
        </Resizable.PanelGroup>
      </div>
    </div>
  );
}
